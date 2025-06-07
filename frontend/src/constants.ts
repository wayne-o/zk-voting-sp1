// Contract address - update this after deployment
export const VOTING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Contract ABI - minimal ABI for the functions we need
export const VOTING_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "name": "nullifierUsed",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes", "name": "proof", "type": "bytes" },
      { "internalType": "bytes", "name": "publicValues", "type": "bytes" }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint32", "name": "candidateId", "type": "uint32" }
    ],
    "name": "getVoteCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];