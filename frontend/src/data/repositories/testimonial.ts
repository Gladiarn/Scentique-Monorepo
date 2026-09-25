import type { Testimonial } from "@scentique/shared";

export interface TestimonialRepository {
  findAll(): Promise<Testimonial[]>;
}
