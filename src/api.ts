import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("🌐 API Module Loaded - Base URL:", API_BASE_URL);

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
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("📥API RESPONSE SUCCESS:");
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
  },
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
    policy_id?: string;
    asset_name?: string;
  }>;
}

export interface TransferBatchPayload {
  batch_id: string;
  from_wallet: string;
  to_wallet: string;
  tx_hash: string;
  policy_id?: string;
  asset_name?: string;
}

export interface PharmacyDashboardStats {
  success: boolean;
  total_inventory: number;
  pending_transfers: number;
  inventory: any[];
  incoming: any[];
}

export interface ShopMedicineItem {
  inventoryId: string;
  medicineName: string;
  composition: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate: string;
  quantityAvailable: number;
  pricePerUnit: number;
  batchId: string;
  pharmacyName: string;
  nftToken: string;
  latestTxHash?: string;
}

export interface CartDto {
  id: string;
  total_price: string;
  total_items: number;
  items: Array<{
    id: string;
    medicine_name: string;
    quantity: number;
    price_per_unit: string;
    subtotal: string;
    pharmacy_name: string;
    pharmacy_id: string;
  }>;
}

export interface ReceiveBatchPayload {
  batch_id: string;
  wallet_address: string;
  price_per_unit: number;
}

export const transferBatchAPI = async (data: TransferBatchPayload) => {
  console.log("=== transferBatchAPI FUNCTION CALLED ===");
  console.log(" Payload:", JSON.stringify(data, null, 2));

  try {
    const response = await api.post("/transfer/", data);
    console.log("SUCCESS! Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" transferBatchAPI ERROR:", error);
    throw error;
  }
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

export const getDashboardStats = async (manufacturerId: string) => {
  console.log("getDashboardStats called for:", manufacturerId);

  try {
    const response = await api.get<DashboardStats>(
      `/dashboard/?manufacturer_id=${manufacturerId}`,
    );
    console.log("Dashboard stats received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      " Dashboard API Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getPharmacyDashboardStats = async (
  walletAddress: string,
): Promise<PharmacyDashboardStats> => {
  try {
    const response = await api.get("/pharmacy/dashboard/", {
      params: { wallet_address: walletAddress },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const receiveBatchAPI = async (data: ReceiveBatchPayload) => {
  try {
    const response = await api.post("/pharmacy/receive/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listMarketplaceDrugsAPI = async () => {
  try {
    const response = await api.get("/marketplace/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/** Alias for the new Shop Page */
export const getShopInventory = async (): Promise<ShopMedicineItem[]> => {
  const data = await listMarketplaceDrugsAPI();
  if (data.success && data.drugs) {
    return data.drugs.map((d: any) => ({
      inventoryId: d.id,
      medicineName: d.medicine_name,
      composition: d.batch_details.composition,
      manufacturer: d.batch_details.manufacturer_name,
      manufactureDate: d.batch_details.manufactured_date,
      expiryDate: d.batch_details.expiry_date,
      quantityAvailable: d.quantity_available,
      pricePerUnit: parseFloat(d.price_per_unit),
      batchId: d.batch_id,
      pharmacyName: d.pharmacy_name,
      nftToken: d.batch_details.qr_code || "N/A",
      latestTxHash: d.latest_tx_hash || "N/A",
    }));
  }
  return [];
};

export const addToCartAPI = async (
  userId: number,
  inventoryId: string,
  quantity: number = 1,
) => {
  try {
    const response = await api.post("/cart/add/", {
      user_id: userId,
      inventory_id: inventoryId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/** Alias for the new Shop Page */
export const addItemToPatientCart = async (
  userId: string,
  inventoryId: string,
  quantity: number = 1,
) => {
  return addToCartAPI(parseInt(userId), inventoryId, quantity);
};

export const getCartAPI = async (userId: number) => {
  try {
    const response = await api.get("/cart/", {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/** Alias for the new Shop Page */
export const getPatientCart = async (userId: string): Promise<CartDto> => {
  const data = await getCartAPI(parseInt(userId));
  return data.cart;
};

export const removeItemFromPatientCart = async (itemId: string) => {
  try {
    const response = await api.delete(`/cart/remove/${itemId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrderAPI = async (userId: number, pharmacyId: string) => {
  try {
    const response = await api.post("/orders/create/", {
      user_id: userId,
      pharmacy_id: pharmacyId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
