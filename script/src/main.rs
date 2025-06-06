use sp1_sdk::{ProverClient, SP1ProofWithPublicValues, SP1Stdin};
use clap::Parser;
use serde::{Deserialize, Serialize};

#[derive(Parser)]
struct Args {
    #[arg(long)]
    voter_secret: String,
    #[arg(long)]
    voter_nullifier: String,
    #[arg(long)]
    candidate_id: u32,
    #[arg(long)]
    use_network: bool,
}

#[derive(Serialize, Deserialize)]
pub struct VoteInput {
    voter_secret: [u8; 32],
    voter_nullifier: [u8; 32],
    candidate_id: u32,
    merkle_proof: Vec<[u8; 32]>,
    merkle_root: [u8; 32],
}

// In a real project, this would be the compiled ELF binary
// For now, we'll use a placeholder
const VOTING_ELF: &[u8] = &[];

fn main() {
    // Note: To use this script, first build the voting program with:
    // cd ../voting-program && cargo prove build
    // Then update VOTING_ELF to include the compiled binary
    
    sp1_sdk::utils::setup_logger();
    let args = Args::parse();
    
    // Initialize prover client
    let client = if args.use_network {
        println!("Using network prover...");
        ProverClient::network()
    } else {
        println!("Using local prover...");
        ProverClient::local()
    };
    
    // Prepare inputs
    let mut stdin = SP1Stdin::new();
    
    // In production, these would come from a secure source
    let vote_input = VoteInput {
        voter_secret: hex::decode(&args.voter_secret)
            .expect("Invalid voter secret hex")
            .try_into()
            .expect("Voter secret must be 32 bytes"),
        voter_nullifier: hex::decode(&args.voter_nullifier)
            .expect("Invalid voter nullifier hex")
            .try_into()
            .expect("Voter nullifier must be 32 bytes"),
        candidate_id: args.candidate_id,
        merkle_proof: generate_mock_proof(),
        merkle_root: get_eligible_voters_root(),
    };
    
    stdin.write(&vote_input);
    
    // Generate proof
    println!("Generating voting proof...");
    let (pk, vk) = client.setup(VOTING_ELF);
    
    let proof = if std::env::var("USE_GROTH16").unwrap_or_default() == "true" {
        println!("Using Groth16 for on-chain verification...");
        client.prove(&pk, stdin).groth16().run().expect("Failed to generate proof")
    } else {
        println!("Using standard proving...");
        client.prove(&pk, stdin).run().expect("Failed to generate proof")
    };
    
    println!("Proof generated successfully!");
    println!("Nullifier: 0x{}", hex::encode(&proof.public_values.as_slice()[0..32]));
    println!("Candidate: {}", u32::from_le_bytes(proof.public_values.as_slice()[32..36].try_into().unwrap()));
    println!("Merkle Root: 0x{}", hex::encode(&proof.public_values.as_slice()[36..68]));
    
    // Save proof for contract submission
    save_proof_for_contract(&proof);
}

fn generate_mock_proof() -> Vec<[u8; 32]> {
    // In production, this would be a real merkle proof
    vec![
        [1u8; 32],
        [2u8; 32],
        [3u8; 32],
    ]
}

fn get_eligible_voters_root() -> [u8; 32] {
    // In production, this would be the real merkle root of eligible voters
    [0x42u8; 32]
}

fn save_proof_for_contract(proof: &SP1ProofWithPublicValues) {
    let proof_data = serde_json::json!({
        "proof": hex::encode(&proof.bytes()),
        "publicValues": hex::encode(&proof.public_values),
    });
    
    std::fs::write("voting_proof.json", serde_json::to_string_pretty(&proof_data).unwrap())
        .expect("Failed to save proof");
    
    println!("Proof saved to voting_proof.json");
}