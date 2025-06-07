import React from 'react';
import './App.css';
import { WalletConnect } from './components/WalletConnect';
import { VotingForm } from './components/VotingForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useWallet } from './hooks/useWallet';

function App() {
  const { account } = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <h1>🗳️ Zero-Knowledge Voting</h1>
        <p>Vote privately with SP1 zkVM</p>
      </header>

      <main className="App-main">
        <WalletConnect />
        
        {account && (
          <>
            <VotingForm />
            <ResultsDisplay />
          </>
        )}

        <div className="privacy-notice">
          <h3>🔒 Your Privacy is Protected</h3>
          <p>
            This voting system uses zero-knowledge proofs to ensure your vote 
            remains completely private while still being verifiable.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
