// Fixed API file with detailed logging
// Replace your existing api.ts content with this

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

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("📤 API REQUEST:");
    console.log("  URL:", config.url);
    console.log("  Method:", config.method);
    console.log("  Base URL:", config.baseURL);
    console.log("  Full URL:", `${config.baseURL}${config.url}`);
    console.log("  Headers:", config.headers);
    console.log("  Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("📥 API RESPONSE SUCCESS:");
    console.log("  Status:", response.status);
    console.log("  Data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API RESPONSE ERROR:");
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

export const mintBatchAPI = async (data: MintBatchPayload) => {
  console.log("=== 🔥 mintBatchAPI FUNCTION CALLED ===");
  console.log("📤 Payload:", JSON.stringify(data, null, 2));
  console.log("🌐 API Base URL:", API_BASE_URL);
  console.log("🌐 Full URL:", `${API_BASE_URL}/mint/`);

  try {
    console.log("⏳ Making POST request...");
    const response = await api.post("/mint/", data);
    console.log("✅ SUCCESS! Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ mintBatchAPI ERROR:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};

export const getDashboardStats = async (manufacturerId: string) => {
  console.log("📊 getDashboardStats called for:", manufacturerId);

  try {
    const response = await api.get<DashboardStats>(
      `/dashboard/?manufacturer_id=${manufacturerId}`
    );
    console.log("✅ Dashboard stats received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Dashboard API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
