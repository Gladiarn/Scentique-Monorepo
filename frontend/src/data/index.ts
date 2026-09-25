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
import { failureRateFromEnv } from "./mock/simulate";
import type { CollectionRepository } from "./repositories/collection";
import type { ProductRepository } from "./repositories/product";
import type { TestimonialRepository } from "./repositories/testimonial";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
/** Set NEXT_PUBLIC_MOCK_FAILURE_RATE=1 to make every mock call fail and see the error states. */
const mockOptions = { failureRate: failureRateFromEnv(process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE) };

export const productRepository: ProductRepository = useMocks ? new MockProductRepository(mockOptions) : new ApiProductRepository();
export const collectionRepository: CollectionRepository = useMocks ? new MockCollectionRepository(mockOptions) : new ApiCollectionRepository();
export const testimonialRepository: TestimonialRepository = useMocks ? new MockTestimonialRepository(mockOptions) : new ApiTestimonialRepository();
