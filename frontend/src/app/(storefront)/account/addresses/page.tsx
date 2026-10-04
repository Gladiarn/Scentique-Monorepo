import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { AddressBook } from "@/features/account/address-book";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl md:text-[length:var(--text-4xl)]">
        Saved <Em>addresses</Em>
      </h1>
      <div className="mt-10">
        <AddressBook />
      </div>
    </div>
  );
}
