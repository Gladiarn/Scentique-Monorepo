"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Customer } from "@scentique/shared";

interface SessionState {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
}

/** Mock session: remembered on this device until signed out. Bump `version` when the shape changes. */
export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
    }),
    {
      name: "scentique-session",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customer: state.customer }),
    },
  ),
);
