// Temporary switch: disable Mesh wallet runtime paths to avoid libsodium errors.
export const WALLET_FEATURES_ENABLED = false;

const envFlag = process.env.NEXT_PUBLIC_ASSUME_WALLET_CONNECTED;

// Enabled by default during local development to speed up UI testing.
export const ASSUME_WALLET_CONNECTED =
  envFlag === "true" ||
  (process.env.NODE_ENV === "development" && envFlag !== "false");

export const MOCK_WALLET_ADDRESS =
  "addr_test1qr8z0medisure0demo0wallet0address0x9w4r3";

export const getMockTxHash = () =>
  `mock_tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
