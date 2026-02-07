"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export const useRedirectIfAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const routes: Record<string, string> = {
        patient: "/",
        distributor: "/distributor/dashboard",
        pharmacy: "/pharmacy/dashboard",
        manufacturer: "/manufacturer/dashboard",
      };

      const route = routes[user.role] || "/";
      router.replace(route);
    }
  }, [user, router]);
};
