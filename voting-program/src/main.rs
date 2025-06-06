#![no_main]
sp1_zkvm::entrypoint!(main);

use sp1_zkvm::io;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct VoteInput {
    voter_secret: [u8; 32],
    voter_nullifier: [u8; 32],
    candidate_id: u32,
    merkle_proof: Vec<[u8; 32]>,
    merkle_root: [u8; 32],
}

pub fn main() {
    // Read private inputs
    let input = io::read::<VoteInput>();
    
    // Verify voter is eligible (in merkle tree)
    let voter_leaf = hash_voter(
        &input.voter_secret, 
        &input.voter_nullifier
    );
    
    let computed_root = compute_merkle_root(
        voter_leaf,
        &input.merkle_proof
    );
    
    assert_eq!(
        computed_root, 
        input.merkle_root,
        "Voter not in eligible list"
    );
    
    // Compute nullifier to prevent double voting
    let nullifier = compute_nullifier(&input.voter_nullifier);
    
    // Commit public outputs
    io::commit(&nullifier);
    io::commit(&input.candidate_id);
    io::commit(&input.merkle_root);
}

fn hash_voter(secret: &[u8; 32], nullifier: &[u8; 32]) -> [u8; 32] {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(secret);
    hasher.update(nullifier);
    hasher.finalize().into()
}

fn compute_nullifier(nullifier: &[u8; 32]) -> [u8; 32] {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(b"nullifier");
    hasher.update(nullifier);
    hasher.finalize().into()
}

fn compute_merkle_root(
    leaf: [u8; 32], 
    proof: &[[u8; 32]]
) -> [u8; 32] {
    use sha2::{Sha256, Digest};
    
    let mut current = leaf;
    for sibling in proof {
        let mut hasher = Sha256::new();
        // Sort to ensure consistent ordering
        if current < *sibling {
            hasher.update(&current);
            hasher.update(sibling);
        } else {
            hasher.update(sibling);
            hasher.update(&current);
        }
        current = hasher.finalize().into();
    }
    current
}
