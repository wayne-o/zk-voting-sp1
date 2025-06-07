import { ethers } from 'ethers';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../constants';

export class ContractService {
  private contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      VOTING_CONTRACT_ADDRESS,
      VOTING_CONTRACT_ABI,
      signer
    );
  }

  async hasVoted(nullifier: string): Promise<boolean> {
    return await this.contract.nullifierUsed(nullifier);
  }

  async submitVote(
    proof: string,
    publicValues: string
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.castVote(proof, publicValues);
  }

  async getVoteCount(candidateId: number): Promise<number> {
    const count = await this.contract.getVoteCount(candidateId);
    return count.toNumber();
  }

  async getTotalVotes(): Promise<number> {
    // Sum votes for all candidates
    let total = 0;
    for (let i = 1; i <= 3; i++) {
      const count = await this.contract.getVoteCount(i);
      total += count.toNumber();
    }
    return total;
  }
}