import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ContractService } from '../services/contractService';

interface VoteResults {
  candidate1: number;
  candidate2: number;
  candidate3: number;
  total: number;
}

export const ResultsDisplay: React.FC = () => {
  const { signer } = useWallet();
  const [results, setResults] = useState<VoteResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!signer) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const contractService = new ContractService(signer);
        const [candidate1, candidate2, candidate3, total] = await Promise.all([
          contractService.getVoteCount(1),
          contractService.getVoteCount(2),
          contractService.getVoteCount(3),
          contractService.getTotalVotes(),
        ]);

        setResults({ candidate1, candidate2, candidate3, total });
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [signer]);

  if (loading && !results) {
    return <div>Loading results...</div>;
  }

  if (!results) {
    return null;
  }

  const getPercentage = (votes: number) => {
    return results.total > 0 ? ((votes / results.total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="results-display">
      <h2>Current Results</h2>
      <p className="total-votes">Total Votes: {results.total}</p>
      
      <div className="results-bars">
        <div className="result-item">
          <div className="candidate-name">Alice Johnson</div>
          <div className="result-bar">
            <div 
              className="result-fill"
              style={{ width: `${getPercentage(results.candidate1)}%` }}
            />
            <span className="result-text">
              {results.candidate1} votes ({getPercentage(results.candidate1)}%)
            </span>
          </div>
        </div>

        <div className="result-item">
          <div className="candidate-name">Bob Smith</div>
          <div className="result-bar">
            <div 
              className="result-fill"
              style={{ width: `${getPercentage(results.candidate2)}%` }}
            />
            <span className="result-text">
              {results.candidate2} votes ({getPercentage(results.candidate2)}%)
            </span>
          </div>
        </div>

        <div className="result-item">
          <div className="candidate-name">Carol Williams</div>
          <div className="result-bar">
            <div 
              className="result-fill"
              style={{ width: `${getPercentage(results.candidate3)}%` }}
            />
            <span className="result-text">
              {results.candidate3} votes ({getPercentage(results.candidate3)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};