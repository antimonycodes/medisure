import { useState, useEffect, useCallback } from "react";

interface UseWalletBalanceReturn {
  balance: number;
  checking: boolean;
  checkBalance: () => Promise<void>;
}

export const useWalletBalance = (
  connected: boolean,
  wallet: any
): UseWalletBalanceReturn => {
  const [balance, setBalance] = useState<number>(0);
  const [checking, setChecking] = useState(false);

  const checkBalance = useCallback(async () => {
    if (connected && wallet) {
      setChecking(true);
      try {
        const utxos = await wallet.getUtxos();
        let totalLovelace = 0;

        if (utxos && utxos.length > 0) {
          utxos.forEach((utxo: any) => {
            const lovelace = utxo.output.amount.find(
              (a: any) => a.unit === "lovelace"
            );
            if (lovelace) {
              totalLovelace += parseInt(lovelace.quantity);
            }
          });
        }

        const ada = totalLovelace / 1000000;
        setBalance(ada);
        console.log(`💰 Wallet Balance: ${ada} ADA`);
      } catch (error) {
        console.error("Error checking balance:", error);
        setBalance(0);
      } finally {
        setChecking(false);
      }
    } else {
      setBalance(0);
    }
  }, [connected, wallet]);

  useEffect(() => {
    checkBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(checkBalance, 30000);
    return () => clearInterval(interval);
  }, [checkBalance]);

  return { balance, checking, checkBalance };
};
