import { useState, useCallback } from 'react';
import { useWallet } from './useWallet';
import { ProofService } from '../services/proofService';
import { ContractService } from '../services/contractService';

export const useVoting = () => {
  const { account, signer } = useWallet();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitVote = useCallback(async (candidateId: number) => {
    if (!account || !signer) {
      setError('Please connect your wallet');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Generate proof
      const proofService = new ProofService();
      const { proof, publicValues, nullifier } = await proofService.generateProof(
        candidateId,
        account
      );

      // Check if already voted
      const contractService = new ContractService(signer);
      const hasVoted = await contractService.hasVoted(nullifier);
      
      if (hasVoted) {
        throw new Error('You have already voted');
      }

      // Submit vote
      const tx = await contractService.submitVote(proof, publicValues);
      await tx.wait();

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  }, [account, signer]);

  return {
    submitVote,
    submitting,
    error,
    success,
  };
};