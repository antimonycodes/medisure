import { User } from "./types";

/**
 * Get the manufacturer ID from localStorage
 */
export const getManufacturerId = (): string | null => {
  if (typeof window === "undefined") return null;

  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    try {
      const user: User = JSON.parse(authUser);
      return user.entityId || null;
    } catch (e) {
      console.error("Error parsing auth_user from localStorage:", e);
      return null;
    }
  }
  return null;
};

/**
 * Get the manufacturer name from localStorage
 */
export const getManufacturerName = (): string | null => {
  if (typeof window === "undefined") return null;

  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    try {
      const user: User = JSON.parse(authUser);
      return user.name || user.username || null;
    } catch (e) {
      console.error("Error parsing auth_user from localStorage:", e);
      return null;
    }
  }
  return null;
};

/**
 * Get the auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    try {
      return JSON.parse(authUser);
    } catch (e) {
      console.error("Error parsing auth_user:", e);
      return null;
    }
  }
  return null;
};

/**
 * Save user data to localStorage
 */
export const saveUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_user", JSON.stringify(user));
};

/**
 * Save auth token to localStorage
 */
export const saveAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!(getAuthToken() && getCurrentUser());
};
