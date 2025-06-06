// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";

contract DecentralizedVoting {
    ISP1Verifier public immutable verifier;
    bytes32 public immutable votingProgramVkey;
    bytes32 public immutable eligibleVotersRoot;
    
    mapping(bytes32 => bool) public nullifierUsed;
    mapping(uint32 => uint256) public voteCounts;
    
    event VoteCast(bytes32 indexed nullifier, uint32 candidate);
    
    constructor(
        address _verifier,
        bytes32 _vkey,
        bytes32 _votersRoot
    ) {
        verifier = ISP1Verifier(_verifier);
        votingProgramVkey = _vkey;
        eligibleVotersRoot = _votersRoot;
    }
    
    function castVote(
        bytes calldata proof,
        bytes calldata publicValues
    ) external {
        // Decode public values
        bytes32 nullifier = bytes32(publicValues[0:32]);
        uint32 candidateId = uint32(bytes4(publicValues[32:36]));
        bytes32 merkleRoot = bytes32(publicValues[36:68]);
        
        // Verify the merkle root matches
        require(merkleRoot == eligibleVotersRoot, "Invalid voter set");
        
        // Check nullifier hasn't been used
        require(!nullifierUsed[nullifier], "Already voted");
        
        // Verify the proof
        verifier.verifyProof(votingProgramVkey, publicValues, proof);
        
        // Record the vote
        nullifierUsed[nullifier] = true;
        voteCounts[candidateId]++;
        
        emit VoteCast(nullifier, candidateId);
    }
    
    function getVoteCount(uint32 candidateId) external view returns (uint256) {
        return voteCounts[candidateId];
    }
}