import type { Customer, SavedAddress } from "@scentique/shared";
import type { CustomerRepository, NewAddress } from "../repositories/customer";
import { simulate, type SimulateOptions } from "./simulate";

/** Addresses are kept per email for the session. A reload clears them until the API exists. */
export class MockCustomerRepository implements CustomerRepository {
  private readonly addresses = new Map<string, SavedAddress[]>();
  private sequence = 1;

  constructor(private readonly options: SimulateOptions = {}) {}

  signIn(email: string): Promise<Customer> {
    const normalised = email.trim().toLowerCase();
    const name = normalised.split("@")[0].replace(/[._-]+/g, " ");
    return simulate({ email: normalised, fullName: name }, this.options);
  }

  listAddresses(email: string): Promise<SavedAddress[]> {
    return simulate([...(this.addresses.get(email) ?? [])], this.options);
  }

  saveAddress(email: string, id: string | null, address: NewAddress): Promise<SavedAddress> {
    const list = this.addresses.get(email) ?? [];
    const saved: SavedAddress = { ...address, id: id ?? `addr-${this.sequence++}` };
    this.addresses.set(email, id ? list.map((a) => (a.id === id ? saved : a)) : [...list, saved]);
    return simulate(saved, this.options);
  }

  deleteAddress(email: string, id: string): Promise<void> {
    this.addresses.set(email, (this.addresses.get(email) ?? []).filter((a) => a.id !== id));
    return simulate(undefined, this.options);
  }
}
