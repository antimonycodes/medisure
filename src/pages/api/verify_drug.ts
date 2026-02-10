import type { NextApiRequest, NextApiResponse } from 'next';
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

const API = new BlockFrostAPI({
    projectId: 'preprodxn3hmhi1G1VXPgoqCpKZCINsRPFNZVhd',
});

type BatchRecord = {
    batch_id: string;
    medicine_name?: string;
    composition?: string;
    expiry_date?: string;
    quantity?: number | string;
    manufacturer_wallet?: string;
};

const isHex = (value: string) => /^[0-9a-fA-F]+$/.test(value);
const isPolicyId = (value: string) => value.length === 56 && isHex(value);
const isAssetId = (value: string) => value.length > 56 && isHex(value);

const fetchBatchFromBackend = async (batchId: string): Promise<BatchRecord | null> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(`${baseUrl}/batches/`, {
            signal: controller.signal,
        });
        if (!response.ok) return null;

        const payload = await response.json();
        const list: BatchRecord[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.results)
                ? payload.results
                : [];

        return (
            list.find(
                (item) =>
                    item.batch_id?.toLowerCase() === batchId.toLowerCase()
            ) || null
        );
    } catch {
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { assetId } = req.query;
    const searchInput = assetId?.toString().trim();

    try {
        if (!searchInput) {
            return res.status(200).json({ isValid: false, message: "No batch or asset code provided." });
        }

        // Smart search logic

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
        // CASE 2: Normal batch code (BATCH-...): verify from backend records
        else if (!isHex(searchInput) || searchInput.includes("-")) {
            const batch = await fetchBatchFromBackend(searchInput);
            if (!batch) {
                return res.status(200).json({
                    isValid: false,
                    message: "Batch not found.",
                });
            }

            return res.status(200).json({
                isValid: true,
                drugName: batch.medicine_name || batch.composition || "Unknown Drug",
                manufacturer: batch.manufacturer_wallet || "Registered Manufacturer",
                expiry: batch.expiry_date || "N/A",
                batchId: batch.batch_id,
                quantity: batch.quantity?.toString() || "N/A",
                source: "database",
            });
        }

        // CASE 3: Input is a POLICY ID (56 hex chars)
        // If you paste your Policy ID, we find your latest minted drug!
        else if (isPolicyId(searchInput)) {
            console.log("Searching by Policy ID:", searchInput);
            const policyAssets = await API.assetsPolicyById(searchInput);

            if (policyAssets.length > 0) {
                // Get the most recent one (last in the list)
                assetId = policyAssets[policyAssets.length - 1].asset;
                console.log("Found latest drug for this manufacturer:", assetId);
            } else {
                return res.status(200).json({ isValid: false, message: "No drugs found for this Manufacturer Policy." });
            }
        }
        // CASE 4: Full asset id (hex)
        else if (!isAssetId(searchInput)) {
            return res.status(200).json({
                isValid: false,
                message: "Invalid batch or asset format.",
            });
        }

        // Standard Asset ID search
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
        res.status(200).json({ isValid: false, error: "Product not found on Cardano Preprod" });
    }
}
