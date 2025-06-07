import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connecting: boolean;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: null,
    provider: null,
    signer: null,
    connecting: false,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setState(prev => ({ ...prev, connecting: true }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      
      setState({
        account: accounts[0],
        provider,
        signer,
        connecting: false,
      });
    } catch (error) {
      console.error('Failed to connect:', error);
      setState(prev => ({ ...prev, connecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      account: null,
      provider: null,
      signer: null,
      connecting: false,
    });
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connect();
          }
        });
    }
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
  };
};