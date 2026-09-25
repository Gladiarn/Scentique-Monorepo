export interface SimulateOptions {
  /** Fixed latency in ms. Omit for a random 150-600 ms. */
  latencyMs?: number;
  /** 0-1 probability that a call rejects. Default 0. */
  failureRate?: number;
}

export async function simulate<T>(value: T, { latencyMs, failureRate = 0 }: SimulateOptions = {}): Promise<T> {
  const wait = latencyMs ?? 150 + Math.random() * 450;
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  if (failureRate > 0 && Math.random() < failureRate) throw new Error("Mock request failed");
  return value;
}

/** Parses NEXT_PUBLIC_MOCK_FAILURE_RATE: 0 (default, off) to 1 (every mock call fails). Invalid values mean off. */
export function failureRateFromEnv(raw: string | undefined): number {
  const n = Number(raw);
  if (!raw || Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
