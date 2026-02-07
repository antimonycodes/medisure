import type { NextApiRequest, NextApiResponse } from 'next';

const pkg = require('@blockfrost/blockfrost-js');
const Blockfrost = pkg.Blockfrost || pkg.BlockFrostAPI || pkg.default || pkg;

const API = new Blockfrost({
    projectId: 'preprodxn3hmhi1G1VXPgoqCpKZCINsRPFNZVhd',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { assetId } = req.query;
    const searchInput = assetId?.toString().trim();

    try {
        // 🕵️ SMART SEARCH LOGIC 🕵️

        // CASE 1: "Demo Mode" (Type 'demo')
        if (searchInput === 'demo') {
            const recent = await API.assets({ order: 'desc', count: 20 });
            for (const item of recent) {
                try {
                    const d = await API.assetsById(item.asset);
                    if (d.onchain_metadata) { assetId = item.asset; break; }
                } catch (e) { }
            }
        }

        // CASE 2: Input is a POLICY ID (56 characters)
        // If you paste your Policy ID, we find your latest minted drug!
        else if (searchInput?.length === 56) {
            console.log("🏭 Searching by Policy ID:", searchInput);
            const policyAssets = await API.assetsPolicyById(searchInput);

            if (policyAssets.length > 0) {
                // Get the most recent one (last in the list)
                assetId = policyAssets[policyAssets.length - 1].asset;
                console.log("✅ Found latest drug for this manufacturer:", assetId);
            } else {
                return res.status(200).json({ isValid: false, message: "No drugs found for this Manufacturer Policy." });
            }
        }

        // CASE 3: Standard Asset ID search (Default)
        // (Proceeds with whatever 'assetId' we found above)

        // --- FETCH DETAILS ---
        const asset = await API.assetsById(assetId);
        const metadata = asset.onchain_metadata;

        if (!metadata) {
            return res.status(200).json({ isValid: false, message: "Token found, but has no medical data." });
        }

        // SUCCESS!
        res.status(200).json({
            isValid: true,
            drugName: metadata.name || "Unknown Drug",
            manufacturer: metadata.properties?.manufacturer || "Unknown Factory",
            expiry: metadata.properties?.expiry || "2028-01-01",
            batchId: metadata.properties?.batch_id || "Unknown ID",
            quantity: metadata.properties?.quantity || "N/A",
            image: metadata.image,
            // We add the Policy ID here so you can verify it matches yours
            policyId: asset.policy_id
        });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ isValid: false, error: "Product not found on Cardano Preprod" });
    }
}