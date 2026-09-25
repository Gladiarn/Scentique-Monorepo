import { formatMoney } from "@/lib/format";

/* Internal specimen page. All copy is synthetic placeholder text. */

const DISPLAY = [
  { name: "Gilda Display", css: "var(--font-gilda)", note: "Soft, calligraphic contrast. Single weight." },
  { name: "Bodoni Moda", css: "var(--font-bodoni)", note: "Sharp fashion Didone with italics. Strongest contrast." },
  { name: "Bellefair", css: "var(--font-bellefair)", note: "Light, airy, classical proportions. Single weight." },
];

const BODY = [
  { name: "Hanken Grotesk", css: "var(--font-hanken)" },
  { name: "Albert Sans", css: "var(--font-albert)" },
];

const SWATCHES = [
  ["page", "Espresso"],
  ["surface", "Umber"],
  ["raised", "Cocoa"],
  ["line", "Hairline"],
  ["ink", "Bone"],
  ["muted", "Taupe"],
  ["accent", "Champagne"],
  ["woody", "Cedar"],
  ["floral", "Dusty rose"],
  ["citrus", "Zest"],
  ["oud", "Oxblood"],
  ["success", "Sage"],
  ["warning", "Burnt amber"],
  ["danger", "Brick"],
] as const;

export default function DesignPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-24">
      <header className="space-y-3">
        <p className="text-sm text-muted">Internal specimen · synthetic copy</p>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display-face)" }}>
          Type and colour specimen
        </h1>
        <p className="max-w-prose text-muted">
          Pick one display face and one body face. Each block below uses real Scentique copy at the sizes the site will use.
        </p>
      </header>

      <section aria-labelledby="display" className="space-y-16">
        <h2 id="display" className="text-xl text-accent">Display candidates</h2>
        {DISPLAY.map((f) => (
          <article key={f.name} className="space-y-6 border-t border-line pt-8">
            <p className="text-sm text-muted">{f.name}. {f.note}</p>
            <div style={{ fontFamily: f.css }} className="space-y-4">
              <p className="text-[length:var(--text-display)] leading-[1.02] tracking-tight">
                Made in small batches from rare ingredients
              </p>
              <p className="text-3xl leading-tight">Ember Oud</p>
              <p className="text-xl">Smoked cedar, aged oud, a thread of saffron.</p>
              <p className="text-lg text-muted">{formatMoney(12800)} · 50 ml Extrait de Parfum</p>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="body" className="space-y-12">
        <h2 id="body" className="text-xl text-accent">Body candidates</h2>
        <div className="grid gap-12 md:grid-cols-2">
          {BODY.map((f) => (
            <article key={f.name} className="space-y-4 border-t border-line pt-8" style={{ fontFamily: f.css }}>
              <p className="text-sm text-muted">{f.name}</p>
              <p className="text-lg">Top notes of bergamot and pink pepper open onto a heart of iris, settling into vetiver and amber.</p>
              <p className="max-w-prose text-muted">
                Each batch is blended by hand in twelve-litre lots and rests for six weeks before it is bottled. Choose a size,
                choose a concentration, and we will ship it within two working days.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 items-center rounded-md bg-accent px-6 font-medium text-page">Add to bag</span>
                <span className="inline-flex h-11 items-center rounded-md border border-line px-6">Find your scent</span>
                <span className="text-sm text-muted">Free shipping over {formatMoney(9000)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="colour" className="space-y-8">
        <h2 id="colour" className="text-xl text-accent">Palette</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {SWATCHES.map(([token, name]) => (
            <li key={token} className="space-y-2">
              <div className="h-20 rounded-md border border-line" style={{ background: `var(--color-${token})` }} />
              <p className="text-sm">{name}</p>
              <p className="text-xs text-muted">--color-{token}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          {(["woody", "floral", "citrus", "oud"] as const).map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 text-sm capitalize"
              style={{ borderColor: `var(--color-${f})`, background: `color-mix(in oklab, var(--color-${f}) 16%, transparent)` }}
            >
              <span className="size-2 rounded-pill" style={{ background: `var(--color-${f})` }} />
              {f}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
