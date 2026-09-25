import type { TestimonialRepository } from "../repositories/testimonial";

const notReady = (): never => {
  throw new Error("ApiTestimonialRepository is not implemented yet (backend milestone M2)");
};

export class ApiTestimonialRepository implements TestimonialRepository {
  findAll = notReady;
}
