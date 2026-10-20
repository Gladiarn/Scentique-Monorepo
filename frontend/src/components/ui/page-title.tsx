import type { ReactNode } from "react";

/** The one h1 of a page, with an optional line under it. */
export function PageTitle({ children, lead }: { children: ReactNode; lead?: ReactNode }) {
  return (
    <header className="pb-16 pt-32">
      <h1 className="font-display text-4xl md:text-[length:var(--text-4xl)]">{children}</h1>
      {lead && <p className="mt-4 max-w-[56ch] text-lg text-muted">{lead}</p>}
    </header>
  );
}
