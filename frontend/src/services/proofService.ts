import axios from 'axios';

interface VoteInput {
  voterSecret: string;
  voterNullifier: string;
  candidateId: number;
  merkleProof: string[];
  merkleRoot: string;
}

interface ProofResponse {
  proof: string;
  publicValues: string;
  nullifier: string;
}

export class ProofService {
  private apiUrl: string;

  constructor(apiUrl = process.env.REACT_APP_PROOF_API_URL || 'http://localhost:8080') {
    this.apiUrl = apiUrl;
  }

  async generateVoterCredentials(address: string): Promise<{
    secret: string;
    nullifier: string;
  }> {
    // In production, this would use proper key derivation
    const encoder = new TextEncoder();
    const data = encoder.encode(address + Date.now());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      secret: hashHex,
      nullifier: hashHex.split('').reverse().join(''),
    };
  }

  async generateProof(
    candidateId: number,
    voterAddress: string
  ): Promise<ProofResponse> {
    try {
      const { secret, nullifier } = await this.generateVoterCredentials(voterAddress);
      
      // In production, fetch real merkle proof from server
      const voteInput: VoteInput = {
        voterSecret: secret,
        voterNullifier: nullifier,
        candidateId,
        merkleProof: [], // Empty for demo (voter is root)
        merkleRoot: await this.computeMerkleRoot(secret, nullifier),
      };

      // Call proof generation API
      const response = await axios.post(`${this.apiUrl}/generate-proof`, voteInput);
      
      return response.data;
    } catch (error) {
      console.error('Proof generation failed:', error);
      throw new Error('Failed to generate zero-knowledge proof');
    }
  }

  private async computeMerkleRoot(secret: string, nullifier: string): Promise<string> {
    // This should match the circuit's hash_voter function
    const encoder = new TextEncoder();
    const data = encoder.encode(secret + nullifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}