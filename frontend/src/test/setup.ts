import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest runs with globals: false, so Testing Library cannot register its own cleanup.
afterEach(() => cleanup());
