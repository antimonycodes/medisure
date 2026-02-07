"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { Role } from "@/constants/roles";

export const useRequireRole = (allowed: Role[]) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
      return;
    }

    if (!allowed.includes(user.role as Role)) {
      router.replace("/unauthorized");
    }
  }, [user, allowed, router]);
};
