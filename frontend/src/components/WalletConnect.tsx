import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletConnect: React.FC = () => {
  const { account, connecting, connect, disconnect } = useWallet();

  return (
    <div className="wallet-connect">
      {!account ? (
        <button onClick={connect} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};