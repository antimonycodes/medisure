/**
 * Application-wide constants and configuration
 */

// Cardano Policy ID for NFTs
export const MY_POLICY_ID =
  "dea909d9658e872bd9827cafda7a5d415c753a9ff3310a3f59dad227";

// Minimum ADA required for transactions
export const MIN_ADA_BALANCE = 3;

// Faucet URL for test ADA
export const FAUCET_URL = "https://faucet.preprod.world.dev.cardano.org/";

// Cardano explorer URL
export const CARDANO_EXPLORER_URL = "https://preprod.cardanoscan.io";

// Default manufacturer name
export const DEFAULT_MANUFACTURER = "PharmaCorp Ltd";

// Balance refresh interval (in milliseconds)
export const BALANCE_REFRESH_INTERVAL = 30000; // 30 seconds

// Status color mappings
export const STATUS_COLORS = {
  Active: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  Minted: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  "In Transit": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Expired: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  MINT_BATCH: "/mint/",
  DASHBOARD_STATS: "/api/dashboard/",
  TRANSFER_BATCH: "/api/transfer/",
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH_USER: "auth_user",
} as const;

// Transaction success messages
export const MESSAGES = {
  MINT_SUCCESS: "✅ Minted successfully! Batch ID:",
  TRANSFER_SUCCESS: "✅ Transfer Successful!",
  CONNECT_WALLET: "❌ Please connect your wallet first",
  INSUFFICIENT_FUNDS: "❌ Insufficient ADA Balance!",
  BATCH_NOT_MINTED:
    "❌ This batch wasn't minted yet. Only minted batches can be transferred!",
  INVALID_ADDRESS:
    "❌ Invalid Cardano address. Must start with 'addr' or 'addr_test'",
} as const;

// Validation patterns
export const VALIDATION = {
  CARDANO_ADDRESS_PATTERN: /^(addr|addr_test)/,
  BATCH_ID_PATTERN: /^BATCH-\d+$/,
} as const;
