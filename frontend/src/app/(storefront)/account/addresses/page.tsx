import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { AddressBook } from "@/features/account/address-book";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div>
      <p className="font-display text-3xl md:text-[length:var(--text-4xl)]">
        Saved <Em>addresses</Em>
      </p>
      <div className="mt-10">
        <AddressBook />
      </div>
    </div>
  );
}
