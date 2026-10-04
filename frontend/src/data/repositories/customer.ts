import type { Customer, SavedAddress } from "@scentique/shared";

export type NewAddress = Omit<SavedAddress, "id">;

export interface CustomerRepository {
  /** Mock sign-in: any well-formed email signs in. The API will check credentials. */
  signIn(email: string): Promise<Customer>;
  listAddresses(email: string): Promise<SavedAddress[]>;
  saveAddress(email: string, id: string | null, address: NewAddress): Promise<SavedAddress>;
  deleteAddress(email: string, id: string): Promise<void>;
}
