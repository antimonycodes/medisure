export const ROLES = {
  PATIENT: "patient",
  DISTRIBUTOR: "distributor",
  PHARMACY: "pharmacy",
  MANUFACTURER: "manufacturer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
