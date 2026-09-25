import { formatMoney } from "@/lib/format";

/* Internal reference page: the chosen type and the palette. All copy is synthetic placeholder text. */

const SWATCHES = [
  ["page", "Espresso"], ["surface", "Umber"], ["raised", "Cocoa"], ["line", "Hairline"],
  ["ink", "Bone"], ["muted", "Taupe"], ["accent", "Champagne"],
  ["woody", "Cedar"], ["floral", "Dusty rose"], ["citrus", "Zest"], ["oud", "Oxblood"],
  ["success", "Sage"], ["warning", "Burnt amber"], ["danger", "Brick"],
] as const;

export default function DesignPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      <header className="space-y-3">
        <h1 className="font-display text-3xl">Type and colour reference</h1>
        <p className="max-w-prose text-muted">Gilda Display for headlines, Hanken Grotesk for everything else.</p>
      </header>

      <section aria-labelledby="type" className="space-y-6 border-t border-line pt-8">
        <h2 id="type" className="text-xl text-accent">Type</h2>
        <p className="font-display text-[length:var(--text-display)] leading-[1.02] tracking-[-0.02em]">Made in small batches from rare ingredients</p>
        <p className="font-display text-3xl">Ember Oud</p>
        <p className="font-display text-xl">Smoked cedar, aged oud, a thread of saffron.</p>
        <p className="max-w-[62ch] text-muted">Each batch is blended by hand in twelve-litre lots and rests for six weeks before it is bottled. {formatMoney(12800)} for 50 ml.</p>
      </section>

      <section aria-labelledby="colour" className="space-y-6 border-t border-line pt-8">
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
      </section>
    </main>
  );
}
