

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("API module loaded - Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

api.interceptors.request.use(
  (config) => {
    console.log(" API REQUEST:");
    console.log("  URL:", config.url);
    console.log("  Method:", config.method);
    console.log("  Base URL:", config.baseURL);
    console.log("  Full URL:", `${config.baseURL}${config.url}`);
    console.log("  Headers:", config.headers);
    console.log("  Data:", config.data);
    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API response success:");
    console.log("  Status:", response.status);
    console.log("  Data:", response.data);
    return response;
  },
  (error) => {
    console.error(" API RESPONSE ERROR:");
    if (error.response) {
      console.error("  Status:", error.response.status);
      console.error("  Data:", error.response.data);
      console.error("  Headers:", error.response.headers);
    } else if (error.request) {
      console.error("  No response received");
      console.error("  Request:", error.request);
    } else {
      console.error("  Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export interface MintBatchPayload {
  batch_id: string;
  medicine_name: string;
  composition: string;
  manufacturer_id: string;
  manufactured_date: string;
  expiry_date: string;
  quantity: string;
  policy_id?: string;
  asset_name?: string;
  manufacturer_wallet: string;
  tx_hash: string;
}

export interface DashboardStats {
  success: boolean;
  total_batches: number;
  minted: number;
  in_transit: number;
  batches: Array<{
    batch_id: string;
    medicine_name: string;
    composition: string;
    expiry_date: string;
    status: string;
  }>;
}

export interface TransferBatchPayload {
  batch_id: string;
  from_wallet: string;
  to_wallet: string;
  tx_hash: string;
}

export type SupplyChainEntity = {
  id: string;
  name: string;
  wallet_address: string;
  verified: boolean;
};

type BatchRecord = {
  id: string;
  manufacturer?: string;
  batch_id: string;
  medicine_name?: string;
  composition?: string;
  manufactured_date?: string;
  expiry_date?: string;
  quantity?: number;
  policy_id?: string | null;
  asset_name?: string | null;
  qr_code?: string | null;
  nft_minted?: boolean;
};

type JourneyTx = {
  type: "MINT" | "TRANSFER";
  tx_hash: string;
  timestamp: string;
  from?: string;
  to?: string;
};

type JourneyResponse = {
  success: boolean;
  batch_id: string;
  medicine_name: string;
  journey: JourneyTx[];
};

type TransactionRecord = {
  id: string;
  batch?: string;
  batch_id?: string;
  transaction_type: "MINT" | "TRANSFER";
  from_wallet?: string | null;
  to_wallet?: string | null;
  tx_hash: string;
  timestamp?: string;
};

const normalizeList = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.results)) return payload.results as T[];
  return [];
};

export const mintBatchAPI = async (data: MintBatchPayload) => {
  console.log("=== mintBatchAPI FUNCTION CALLED ===");
  console.log(" Payload:", JSON.stringify(data, null, 2));
  console.log(" API Base URL:", API_BASE_URL);
  console.log(" Full URL:", `${API_BASE_URL}/mint/`);

  try {
    console.log(" Making POST request...");
    const response = await api.post("/mint/", data);
    console.log("SUCCESS! Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" mintBatchAPI ERROR:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};

export const transferBatchAPI = async (data: TransferBatchPayload) => {
  const response = await api.post("/transfer/", data);
  return response.data;
};

export const recordTransferFallbackAPI = async (data: TransferBatchPayload) => {
  const batchesResponse = await api.get("/batches/");
  const batches = normalizeList<BatchRecord>(batchesResponse.data);
  const batch = batches.find((item) => item.batch_id === data.batch_id);

  if (!batch) {
    throw new Error(`Batch ${data.batch_id} not found`);
  }

  const txResponse = await api.post("/transactions/", {
    batch: batch.id,
    transaction_type: "TRANSFER",
    from_wallet: data.from_wallet,
    to_wallet: data.to_wallet,
    tx_hash: data.tx_hash,
  });

  return txResponse.data;
};

export const recordTransferWithFallback = async (data: TransferBatchPayload) => {
  try {
    return await transferBatchAPI(data);
  } catch {
    return await recordTransferFallbackAPI(data);
  }
};

export const getDashboardStats = async (manufacturerId: string) => {
  console.log("getDashboardStats called for:", manufacturerId);

  try {
    const response = await api.get<DashboardStats>(
      `/dashboard/?manufacturer_id=${manufacturerId}`
    );
    console.log("Dashboard stats received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      " Dashboard API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBatchDetailsByBatchId = async (batchId: string) => {
  const [batchesResponse, journeyResponse] = await Promise.all([
    api.get("/batches/"),
    api.get<JourneyResponse>(`/journey/${encodeURIComponent(batchId)}/`),
  ]);

  const batches = normalizeList<BatchRecord>(batchesResponse.data);
  const batch = batches.find((item) => item.batch_id === batchId);
  if (!batch) {
    throw new Error(`Batch ${batchId} not found`);
  }

  const journey = journeyResponse.data?.journey || [];
  const lastTx = journey[journey.length - 1];
  const transferred = journey.some((entry) => entry.type === "TRANSFER");
  const status = !batch.nft_minted
    ? "Pending"
    : transferred
    ? "In Transit"
    : "Minted";

  return {
    batch_id: batch.batch_id,
    qr_code: batch.qr_code || "",
    medicine_name: batch.medicine_name || "",
    composition: batch.composition || "",
    expiry_date: batch.expiry_date || "",
    manufacture_date: batch.manufactured_date || "",
    quantity: String(batch.quantity ?? ""),
    tx_hash: lastTx?.tx_hash || "",
    policy_id: batch.policy_id || "",
    asset_name: batch.asset_name || "",
    status,
  };
};

export const getDistributors = async () => {
  const response = await api.get("/distributors/");
  return normalizeList<SupplyChainEntity>(response.data);
};

export const getPharmacies = async () => {
  const response = await api.get("/pharmacies/");
  return normalizeList<SupplyChainEntity>(response.data);
};

export const getManufacturers = async () => {
  const response = await api.get("/manufacturers/");
  return normalizeList<SupplyChainEntity>(response.data);
};

export const getDistributorById = async (distributorId: string) => {
  const response = await api.get<SupplyChainEntity>(
    `/distributors/${encodeURIComponent(distributorId)}/`
  );
  return response.data;
};

export const getPharmacyById = async (pharmacyId: string) => {
  const response = await api.get<SupplyChainEntity>(
    `/pharmacies/${encodeURIComponent(pharmacyId)}/`
  );
  return response.data;
};

export type DistributorBatchItem = {
  id: string;
  batchId: string;
  medicineName: string;
  composition: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  status: "Available" | "In Transit";
  supplier: string;
  category: string;
  nftToken: string;
  transferCount: number;
  lastTransferTxHash?: string;
  currentHolderWallet?: string;
  fromWallet?: string;
  receivedAt?: string;
};

export type PharmacyBatchItem = {
  id: string;
  batchId: string;
  medicineName: string;
  composition: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  status: "Available" | "In Transit";
  supplier: string;
  category: string;
  nftToken: string;
  transferCount: number;
  lastTransferTxHash?: string;
  currentHolderWallet?: string;
  fromWallet?: string;
  receivedAt?: string;
};

export type ShopMedicineItem = {
  inventoryId: string;
  pharmacyId: string;
  pharmacyName: string;
  batchId: string;
  medicineName: string;
  composition: string;
  manufacturer: string;
  expiryDate: string;
  manufactureDate: string;
  quantityAvailable: number;
  pricePerUnit: number;
  nftMinted: boolean;
  nftToken: string;
  latestTxHash: string;
};

export type CartItemDto = {
  id: string;
  inventory_item: string;
  medicine_name: string;
  pharmacy_name: string;
  quantity: number;
  price_per_unit: string;
  subtotal: string;
};

export type CartDto = {
  id: string;
  user: number;
  items: CartItemDto[];
  total_price: string;
  total_items: number;
};

const inferMedicineCategory = (medicineName: string, composition: string) => {
  const text = `${medicineName} ${composition}`.toLowerCase();

  if (
    /(amoxicillin|azithromycin|ciprofloxacin|cefuroxime|antibiotic)/.test(text)
  ) {
    return "Antibiotic";
  }
  if (/(ibuprofen|paracetamol|acetaminophen|pain)/.test(text)) {
    return "Pain Relief";
  }
  if (/(omeprazole|ranitidine|antacid|acid|reducer)/.test(text)) {
    return "Acid Reducer";
  }
  if (/(metformin|insulin|glimepiride|diabetes)/.test(text)) {
    return "Diabetes";
  }
  if (/(lisinopril|amlodipine|losartan|atenolol|pressure|hypertension)/.test(text)) {
    return "Blood Pressure";
  }

  return "General";
};

export const getDistributorDashboardData = async (distributorWallet: string) => {
  const [batchesResponse, transactionsResponse, manufacturers, distributors] =
    await Promise.all([
      api.get("/batches/"),
      api.get("/transactions/"),
      getManufacturers(),
      getDistributors(),
    ]);

  const batches = normalizeList<BatchRecord>(batchesResponse.data);
  const transactions = normalizeList<TransactionRecord>(transactionsResponse.data);
  const walletNameMap = new Map<string, string>();
  for (const m of manufacturers) walletNameMap.set(m.wallet_address, m.name);
  for (const d of distributors) walletNameMap.set(d.wallet_address, d.name);

  const transferMap = new Map<string, TransactionRecord[]>();
  for (const tx of transactions) {
    if (tx.transaction_type !== "TRANSFER") continue;
    const key = tx.batch_id || "";
    if (!key) continue;
    const list = transferMap.get(key) || [];
    list.push(tx);
    transferMap.set(key, list);
  }

  const items: DistributorBatchItem[] = [];
  for (const batch of batches) {
    if (!batch.batch_id) continue;
    const transferTxs = transferMap.get(batch.batch_id) || [];
    if (transferTxs.length === 0) continue;

    const sortedTransfers = [...transferTxs].sort((a, b) => {
      const at = new Date(a.timestamp || 0).getTime();
      const bt = new Date(b.timestamp || 0).getTime();
      return at - bt;
    });
    const receivedByDistributor = sortedTransfers.some(
      (tx) => tx.to_wallet === distributorWallet
    );
    if (!receivedByDistributor) continue;

    const latestTransfer = sortedTransfers[sortedTransfers.length - 1];
    const transferCount = sortedTransfers.length;

    const status: DistributorBatchItem["status"] =
      latestTransfer.to_wallet === distributorWallet ? "Available" : "In Transit";
    const tokenSource =
      latestTransfer.tx_hash || batch.asset_name || batch.batch_id;
    const nftToken =
      tokenSource.length > 14
        ? `NFT-${tokenSource.slice(0, 6)}...${tokenSource.slice(-4)}`
        : `NFT-${tokenSource}`;

    const medicineName = batch.medicine_name || "Unknown Medicine";
    const composition = batch.composition || "-";

    items.push({
      id: batch.id,
      batchId: batch.batch_id,
      medicineName,
      composition,
      manufactureDate: batch.manufactured_date || "-",
      expiryDate: batch.expiry_date || "-",
      quantity: batch.quantity ?? 0,
      status,
      supplier:
        walletNameMap.get(latestTransfer.from_wallet || "") ||
        "Unknown Supplier",
      category: inferMedicineCategory(medicineName, composition),
      nftToken,
      transferCount,
      lastTransferTxHash: latestTransfer.tx_hash,
      currentHolderWallet: latestTransfer.to_wallet || "",
      fromWallet: latestTransfer.from_wallet || "",
      receivedAt: latestTransfer.timestamp,
    });
  }

  return items.sort((a, b) => {
    const at = new Date(a.receivedAt || 0).getTime();
    const bt = new Date(b.receivedAt || 0).getTime();
    return bt - at;
  });
};

export const getPharmacyDashboardData = async (pharmacyWallet: string) => {
  const [batchesResponse, transactionsResponse, distributors] = await Promise.all([
    api.get("/batches/"),
    api.get("/transactions/"),
    getDistributors(),
  ]);

  const batches = normalizeList<BatchRecord>(batchesResponse.data);
  const transactions = normalizeList<TransactionRecord>(transactionsResponse.data);
  const distributorWalletMap = new Map<string, string>();
  for (const d of distributors) distributorWalletMap.set(d.wallet_address, d.name);

  const transferMap = new Map<string, TransactionRecord[]>();
  for (const tx of transactions) {
    if (tx.transaction_type !== "TRANSFER") continue;
    const key = tx.batch_id || "";
    if (!key) continue;
    const list = transferMap.get(key) || [];
    list.push(tx);
    transferMap.set(key, list);
  }

  const items: PharmacyBatchItem[] = [];
  for (const batch of batches) {
    if (!batch.batch_id) continue;
    const transferTxs = transferMap.get(batch.batch_id) || [];
    if (transferTxs.length === 0) continue;

    const sortedTransfers = [...transferTxs].sort((a, b) => {
      const at = new Date(a.timestamp || 0).getTime();
      const bt = new Date(b.timestamp || 0).getTime();
      return at - bt;
    });
    const receivedByPharmacy = sortedTransfers.some(
      (tx) => tx.to_wallet === pharmacyWallet
    );
    if (!receivedByPharmacy) continue;

    const latestTransfer = sortedTransfers[sortedTransfers.length - 1];
    const transferCount = sortedTransfers.length;
    const status: PharmacyBatchItem["status"] =
      latestTransfer.to_wallet === pharmacyWallet ? "Available" : "In Transit";
    const tokenSource =
      latestTransfer.tx_hash || batch.asset_name || batch.batch_id;
    const nftToken =
      tokenSource.length > 14
        ? `NFT-${tokenSource.slice(0, 6)}...${tokenSource.slice(-4)}`
        : `NFT-${tokenSource}`;

    const medicineName = batch.medicine_name || "Unknown Medicine";
    const composition = batch.composition || "-";

    items.push({
      id: batch.id,
      batchId: batch.batch_id,
      medicineName,
      composition,
      manufactureDate: batch.manufactured_date || "-",
      expiryDate: batch.expiry_date || "-",
      quantity: batch.quantity ?? 0,
      status,
      supplier:
        distributorWalletMap.get(latestTransfer.from_wallet || "") ||
        "Unknown Distributor",
      category: inferMedicineCategory(medicineName, composition),
      nftToken,
      transferCount,
      lastTransferTxHash: latestTransfer.tx_hash,
      currentHolderWallet: latestTransfer.to_wallet || "",
      fromWallet: latestTransfer.from_wallet || "",
      receivedAt: latestTransfer.timestamp,
    });
  }

  return items.sort((a, b) => {
    const at = new Date(a.receivedAt || 0).getTime();
    const bt = new Date(b.receivedAt || 0).getTime();
    return bt - at;
  });
};

export const getShopInventory = async () => {
  const [
    inventoryResponse,
    batchesResponse,
    manufacturersResponse,
    pharmaciesResponse,
    transactionsResponse,
  ] = await Promise.all([
    api.get("/inventory/"),
    api.get("/batches/"),
    api.get("/manufacturers/"),
    api.get("/pharmacies/"),
    api.get("/transactions/"),
  ]);

  const inventory = normalizeList<any>(inventoryResponse.data);
  const batches = normalizeList<BatchRecord>(batchesResponse.data);
  const manufacturers = normalizeList<SupplyChainEntity>(manufacturersResponse.data);
  const pharmacies = normalizeList<SupplyChainEntity>(pharmaciesResponse.data);
  const transactions = normalizeList<TransactionRecord>(transactionsResponse.data);

  const batchById = new Map<string, BatchRecord>();
  for (const batch of batches) {
    if (batch.id) batchById.set(batch.id, batch);
  }

  const manufacturerById = new Map<string, string>();
  for (const manufacturer of manufacturers) {
    if (manufacturer.id) manufacturerById.set(manufacturer.id, manufacturer.name);
  }

  const pharmacyById = new Map<string, string>();
  for (const pharmacy of pharmacies) {
    if (pharmacy.id) pharmacyById.set(pharmacy.id, pharmacy.name);
  }

  const latestTxByBatchId = new Map<string, TransactionRecord>();
  for (const tx of transactions) {
    const current = latestTxByBatchId.get(tx.batch_id || "");
    if (!tx.batch_id) continue;
    if (!current) {
      latestTxByBatchId.set(tx.batch_id, tx);
      continue;
    }
    const currentTs = new Date(current.timestamp || 0).getTime();
    const txTs = new Date(tx.timestamp || 0).getTime();
    if (txTs > currentTs) latestTxByBatchId.set(tx.batch_id, tx);
  }

  const items: ShopMedicineItem[] = [];
  for (const row of inventory) {
    if (!row.in_stock) continue;
    const batch = batchById.get(row.batch);
    if (!batch || !batch.nft_minted) continue;

    const latestTx = latestTxByBatchId.get(batch.batch_id || "");
    const tokenSource = latestTx?.tx_hash || batch.asset_name || batch.batch_id || "";
    const nftToken =
      tokenSource.length > 14
        ? `NFT-${tokenSource.slice(0, 6)}...${tokenSource.slice(-4)}`
        : `NFT-${tokenSource}`;

    items.push({
      inventoryId: row.id,
      pharmacyId: row.pharmacy,
      pharmacyName: pharmacyById.get(row.pharmacy) || row.pharmacy_name || "Unknown Pharmacy",
      batchId: batch.batch_id || "",
      medicineName: batch.medicine_name || "Unknown Medicine",
      composition: batch.composition || "-",
      manufacturer:
        manufacturerById.get(String(batch.manufacturer || "")) ||
        "Unknown Manufacturer",
      expiryDate: batch.expiry_date || "",
      manufactureDate: batch.manufactured_date || "",
      quantityAvailable: Number(row.quantity_available || 0),
      pricePerUnit: Number(row.price_per_unit || 0),
      nftMinted: Boolean(batch.nft_minted),
      nftToken,
      latestTxHash: latestTx?.tx_hash || "",
    });
  }

  return items.sort((a, b) => a.medicineName.localeCompare(b.medicineName));
};

export const getPatientCart = async (userId: string | number) => {
  const response = await api.get<{ success: boolean; cart: CartDto }>(
    `/cart/?user_id=${encodeURIComponent(String(userId))}`
  );
  return response.data.cart;
};

export const addItemToPatientCart = async (
  userId: string | number,
  inventoryId: string,
  quantity = 1
) => {
  const response = await api.post("/cart/add/", {
    user_id: userId,
    inventory_id: inventoryId,
    quantity,
  });
  return response.data;
};

export const removeItemFromPatientCart = async (itemId: string) => {
  const response = await api.delete(`/cart/remove/${encodeURIComponent(itemId)}/`);
  return response.data;
};

export const createPatientOrder = async (
  userId: string | number,
  pharmacyId: string
) => {
  const response = await api.post("/orders/create/", {
    user_id: userId,
    pharmacy_id: pharmacyId,
  });
  return response.data;
};

export const getPatientOrders = async (userId: string | number) => {
  const response = await api.get(`/orders/?user_id=${encodeURIComponent(String(userId))}`);
  return response.data?.orders || [];
};

export const getPatientOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${encodeURIComponent(orderId)}/`);
  return response.data?.order;
};

export default api;
