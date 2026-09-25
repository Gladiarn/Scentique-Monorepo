import type { Testimonial } from "@scentique/shared";
import type { TestimonialRepository } from "../repositories/testimonial";
import { testimonialFixtures } from "./fixtures/testimonials";
import { simulate, type SimulateOptions } from "./simulate";

export class MockTestimonialRepository implements TestimonialRepository {
  constructor(private readonly options: SimulateOptions = {}) {}
  findAll(): Promise<Testimonial[]> {
    return simulate(testimonialFixtures, this.options);
  }
}
