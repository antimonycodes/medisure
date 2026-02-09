import { MeshTxBuilder } from "@meshsdk/core";
import { MeshWallet } from "@meshsdk/core";

export async function transferDrugBatch(
  wallet: MeshWallet,
  recipientAddress: string,
  policyId: string,
  assetNameHex: string,
) {
  console.log(" Starting Transfer...");

  // 1. Get Wallet Info
  const changeAddress = await wallet.getChangeAddress();
  const utxos = await wallet.getUtxos();

  if (!utxos || utxos.length === 0) {
    throw new Error("No ADA found.");
  }

  // 2. Build Transaction
  const txBuilder = new MeshTxBuilder({ fetcher: (wallet as any).fetcher });

  const tx = await txBuilder
    .txOut(recipientAddress, [
      { unit: "lovelace", quantity: "2000000" }, // Send 2 ADA (Min required to carry token)
      { unit: policyId + assetNameHex, quantity: "1" }, // The Token itself
    ])
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  // 3. Sign & Submit
  const signedTx = await wallet.signTx(tx);
  const txHash = await wallet.submitTx(signedTx);

  return txHash;
}
