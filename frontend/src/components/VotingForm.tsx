import React, { useState } from 'react';
import { useVoting } from '../hooks/useVoting';

const CANDIDATES = [
  { id: 1, name: 'Alice Johnson', party: 'Progressive' },
  { id: 2, name: 'Bob Smith', party: 'Conservative' },
  { id: 3, name: 'Carol Williams', party: 'Independent' },
];

export const VotingForm: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const { submitVote, submitting, error, success } = useVoting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidate === null) {
      alert('Please select a candidate');
      return;
    }
    
    await submitVote(selectedCandidate);
  };

  if (success) {
    return (
      <div className="success-message">
        <h3>✅ Vote Submitted Successfully!</h3>
        <p>Your vote has been recorded anonymously.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="voting-form">
      <h2>Cast Your Vote</h2>
      
      <div className="candidates">
        {CANDIDATES.map(candidate => (
          <label key={candidate.id} className="candidate-option">
            <input
              type="radio"
              name="candidate"
              value={candidate.id}
              checked={selectedCandidate === candidate.id}
              onChange={() => setSelectedCandidate(candidate.id)}
              disabled={submitting}
            />
            <div className="candidate-info">
              <strong>{candidate.name}</strong>
              <span>{candidate.party}</span>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={submitting || selectedCandidate === null}
      >
        {submitting ? 'Generating Proof...' : 'Submit Vote'}
      </button>
    </form>
  );
};