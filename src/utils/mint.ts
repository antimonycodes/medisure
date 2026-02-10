import type { MeshWallet } from "@meshsdk/core";

export interface DrugBatchData {
  drugName: string;
  batchId: string;
  expiryDate: string;
  manufacturer: string;
  quantity: string;
}

export async function mintDrugBatch(wallet: MeshWallet, data: DrugBatchData) {
  const { MeshTxBuilder, ForgeScript, stringToHex, resolveScriptHash } =
    await import("@meshsdk/core");

  console.log(" Starting Mint Process...");

  // 1. Get Wallet Address
  const changeAddress = await wallet.getChangeAddress();
  console.log(" Address found:", changeAddress);

  const utxos = await wallet.getUtxos();
  if (!utxos || utxos.length === 0) {
    throw new Error("No ADA found. Please use the Faucet.");
  }

  // 2. Define the Script
  const forgingScript = ForgeScript.withOneSignature(changeAddress);
  console.log(" Script created");

  // 3. GET POLICY ID (Using the generic resolver)
  let policyId: string;
  try {
    // We try the generic resolver which is often safer
    policyId = resolveScriptHash(forgingScript);
    console.log(" Policy ID calculated:", policyId);
  } catch (e) {
    console.error("Hashing failed. Trying fallback...", e);
    throw new Error("Could not calculate Policy ID. Please refresh page.");
  }

  // 4. Create Metadata
  const assetMetadata = {
    name: "MediSure-" + data.drugName.replace(/\s/g, ""),
    image: "ipfs://QmRzicpSO...",
    mediaType: "image/jpg",
    description: `Authentic Batch: ${data.batchId}`,
    properties: {
      batch_id: data.batchId,
      expiry: data.expiryDate,
      manufacturer: data.manufacturer,
      quantity: data.quantity,
      verified: "True",
    },
  };

  // 5. Build Transaction
  const txBuilder = new MeshTxBuilder({ fetcher: wallet.fetcher });

  // Convert Name to Hex
  const assetNameString = "Batch" + data.batchId.replace(/[^a-zA-Z0-9]/g, "");
  const assetNameHex = stringToHex(assetNameString);

  const tx = await txBuilder
    .mint("1", policyId, assetNameHex)
    .mintingScript(forgingScript)
    .metadataValue(721, {
      [policyId]: {
        [assetNameString]: assetMetadata,
      },
    })
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  // 6. Sign & Submit
  const signedTx = await wallet.signTx(tx);
  const txHash = await wallet.submitTx(signedTx);

  return txHash;
}
