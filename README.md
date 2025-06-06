# Decentralized Voting System with SP1 zkVM

A privacy-preserving voting system built using Succinct's SP1 zkVM, demonstrating how to build zero-knowledge applications with Rust.

## Overview

This project implements a decentralized voting system where:
- Voters can cast ballots without revealing their identity
- Each voter can only vote once
- Vote tallies are publicly verifiable
- The entire process is trustless

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install SP1
curl -L https://sp1up.succinct.xyz | bash
sp1up

# Verify installation
cargo prove --version
```

## Project Structure

```
zk-voting/
├── voting-program/     # The zkVM program
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
├── script/            # Proof generation scripts
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
└── contracts/         # Smart contracts
    └── VotingVerifier.sol
```

## Building

```bash
# Build the voting program
cd voting-program
cargo prove build

# This will compile the program to the SP1 zkVM target
```

## Running

### Local Proving

```bash
cd script
cargo run -- \
  --voter-secret "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" \
  --voter-nullifier "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" \
  --candidate-id 1
```

### Network Proving (Faster)

First, set up your Succinct Network credentials:

```bash
export SP1_PROVER=network
export SP1_PRIVATE_KEY="your-private-key-here"
```

Then run with the network flag:

```bash
cargo run -- \
  --voter-secret "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" \
  --voter-nullifier "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" \
  --candidate-id 1 \
  --use-network
```

## Smart Contract Deployment

The `VotingVerifier.sol` contract can be deployed to any EVM-compatible chain. You'll need:

1. Deploy the SP1 Verifier contract (or use an existing deployment)
2. Get your program's verification key from the proving process
3. Deploy the voting contract with the verifier address and vkey

## How It Works

1. **Voter Registration**: Voters are added to a Merkle tree off-chain
2. **Voting**: Voters generate a ZK proof that they're in the tree without revealing which leaf
3. **Verification**: The smart contract verifies the proof on-chain
4. **Tallying**: Vote counts are publicly visible and verifiable

## Security Considerations

- Nullifiers prevent double voting
- Merkle proofs ensure only eligible voters can vote
- Zero-knowledge proofs preserve voter privacy
- All verification happens on-chain for trustlessness

## Contributing

Pull requests are welcome! Please feel free to submit issues or PRs.

## License

MIT

## Resources

- [SP1 Documentation](https://docs.succinct.xyz/sp1)
- [SP1 GitHub](https://github.com/succinctlabs/sp1)
- [Succinct Network](https://network.succinct.xyz)

## Tutorial

For a detailed walkthrough of this code, check out our blog post: [Building a Decentralized Voting System with SP1 zkVM](https://innocence.is/blog/building-a-decentralized-voting-system-with-sp1-zkvm/)