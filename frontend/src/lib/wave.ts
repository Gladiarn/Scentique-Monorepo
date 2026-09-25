interface WaveOptions {
  width: number;
  height: number;
  /** Vertical centre line of the wave. */
  base: number;
  amplitude: number;
  /** Whole number of full periods across the width, so the wave tiles seamlessly. */
  periods: number;
  /** Phase offset in radians. */
  phase?: number;
}

/** SVG path for a filled wave that runs edge to edge and closes along the bottom. */
export function wavePath({ width, height, base, amplitude, periods, phase = 0 }: WaveOptions): string {
  const step = 12;
  const y = (x: number) => base + Math.sin((x / width) * periods * Math.PI * 2 + phase) * amplitude;
  const pts: string[] = [`M0 ${y(0).toFixed(1)}`];
  for (let x = step; x < width; x += step) pts.push(`L${x} ${y(x).toFixed(1)}`);
  pts.push(`L${width} ${y(width).toFixed(1)}`, `L${width} ${height}`, `L0 ${height}`, "Z");
  return pts.join(" ");
}
