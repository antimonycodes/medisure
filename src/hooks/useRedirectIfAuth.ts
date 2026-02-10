"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export const useRedirectIfAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Allow opening signin page for testing/switching accounts:
    // /signin?forceLogin=1
    const forceLogin = router.query.forceLogin;
    const shouldBypassRedirect =
      router.pathname === "/signin" &&
      (forceLogin === "1" || forceLogin === "true");
    if (shouldBypassRedirect) return;

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
