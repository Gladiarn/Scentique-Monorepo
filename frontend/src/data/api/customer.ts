import type { CustomerRepository } from "../repositories/customer";

const notReady = (): never => {
  throw new Error("ApiCustomerRepository is not implemented yet (backend milestone M2)");
};

export class ApiCustomerRepository implements CustomerRepository {
  signIn = notReady;
  listAddresses = notReady;
  saveAddress = notReady;
  deleteAddress = notReady;
}
