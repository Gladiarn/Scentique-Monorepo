import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { AddressBook } from "@/features/account/address-book";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div>
      <PageTitle>
        Saved <Em>addresses</Em>
      </PageTitle>
      <div className="mt-10">
        <AddressBook />
      </div>
    </div>
  );
}
