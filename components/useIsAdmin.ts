"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Standalone admin-status hook. Fails closed to `false` on any error,
// missing row, or RLS denial -- never shows the Admin Panel link to
// someone who isn't actually an admin, even transiently. Starts as
// `false` and only flips to `true` once the employees.role check
// resolves, so there's no flash of the admin link for a split second
// before the check completes -- it simply appears once confirmed.
export function useIsAdmin(userId: string | null | undefined): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    let mounted = true;
    supabase
      .from("employees")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return;
        setIsAdmin(!error && data?.role === "admin");
      });
    return () => {
      mounted = false;
    };
  }, [userId]);

  return isAdmin;
}
