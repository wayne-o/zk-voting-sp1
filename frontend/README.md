# Zero-Knowledge Voting UI

A React frontend for the SP1 zkVM-based voting system that enables completely private voting while maintaining verifiability.

## Features

- 🔐 MetaMask wallet integration
- 🗳️ Private ballot casting with zero-knowledge proofs
- 📊 Real-time results display
- 🔒 Complete voter privacy protection
- ⚡ Proof generation in browser

## Prerequisites

- Node.js 16+
- MetaMask browser extension
- Running proof generation server (see parent directory)
- Deployed voting smart contract

## Installation

```bash
npm install
```

## Configuration

Update `src/constants.ts` with your deployed contract address:

```typescript
export const VOTING_CONTRACT_ADDRESS = '0xYOUR_CONTRACT_ADDRESS';
```

Set the proof API URL (if different from default):

```bash
export REACT_APP_PROOF_API_URL=http://localhost:8080
```

## Running the Application

```bash
npm start
```

The app will be available at http://localhost:3000

## Architecture

- **Wallet Connection**: Uses ethers.js for Web3 integration
- **Proof Generation**: Calls backend API to generate SP1 proofs
- **Smart Contract**: Interacts with on-chain voting contract
- **Privacy**: No voter information is stored or transmitted

## Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Type checking
npm run type-check
```

## Security Notes

- Voter credentials are derived deterministically from wallet address
- All proofs are generated server-side for performance
- No tracking or analytics to preserve privacy
- Contract interactions are transparent and verifiable

## Learn More

- [SP1 zkVM Documentation](https://docs.succinct.xyz/)
- [Tutorial: Building the zkVM Circuit](https://example.com/blog/sp1-voting)
- [Smart Contract Repository](https://github.com/wayne-o/zk-voting-sp1)