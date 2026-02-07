export interface Batch {
  id: string;
  composition: string;
  expiryDate: string;
  status: "Active" | "Pending" | "Expired" | "Minted" | "In Transit";
  views?: number;
  medicine_name?: string;
  quantity?: string;
}

export interface FormData {
  batchId: string;
  drugName: string;
  manufactureDate: string;
  expiryDate: string;
  chemicalComposition: string;
  quantity: string;
  manufacturer: string;
}

export interface StatCard {
  id: number;
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  change: string;
}

export type BatchStatus =
  | "Active"
  | "Pending"
  | "Expired"
  | "Minted"
  | "In Transit";

// Backend API response types
export interface BackendBatch {
  batch_id: string;
  medicine_name: string;
  composition: string;
  expiry_date: string;
  status: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  total_batches: number;
  minted: number;
  in_transit: number;
  batches: BackendBatch[];
}

export interface MintResponse {
  success: boolean;
  batch_id: string;
  qr_code: string;
  message: string;
}

export interface User {
  id: string;
  role: string;
  username: string;
  entityId?: string;
}
