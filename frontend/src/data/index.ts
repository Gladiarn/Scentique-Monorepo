/*
 * The ONE place that decides mock vs real. UI code imports only the singletons below,
 * never a concrete repository class. Set NEXT_PUBLIC_USE_MOCKS=false to use the API.
 */
import { ApiCollectionRepository } from "./api/collection";
import { ApiProductRepository } from "./api/product";
import { ApiTestimonialRepository } from "./api/testimonial";
import { MockCollectionRepository } from "./mock/collection";
import { MockProductRepository } from "./mock/product";
import { MockTestimonialRepository } from "./mock/testimonial";
import type { CollectionRepository } from "./repositories/collection";
import type { ProductRepository } from "./repositories/product";
import type { TestimonialRepository } from "./repositories/testimonial";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const productRepository: ProductRepository = useMocks ? new MockProductRepository() : new ApiProductRepository();
export const collectionRepository: CollectionRepository = useMocks ? new MockCollectionRepository() : new ApiCollectionRepository();
export const testimonialRepository: TestimonialRepository = useMocks ? new MockTestimonialRepository() : new ApiTestimonialRepository();
