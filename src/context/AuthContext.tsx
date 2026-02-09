"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { Role } from "@/constants/roles";

interface User {
  id: string;
  role: string;
  username: string;
  entityId?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    token: string,
    userId: string,
    username: string,
    role: string,
    entityId: string,
    name: string,
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  /** Load session from localStorage */
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const redirectByRole = (role: string) => {
    const routes: Record<string, string> = {
      patient: "/patient/dashboard",
      distributor: "/distributor/dashboard",
      pharmacy: "/pharmacy/dashboard",
      manufacturer: "/manufacturer/dashboard",
    };

    const route = routes[role.toLowerCase()] || "/";
    router.replace(route);
  };

  const login = (
    token: string,
    userId: string,
    username: string,
    role: string,
    entityId: string,
    name: string,
  ) => {
    setToken(token);

    const userData: User = {
      id: userId.toString(),
      role: role.toLowerCase(),
      username: username,
      entityId: entityId,
      name: name,
    };

    setUser(userData);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));

    redirectByRole(role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.replace("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
