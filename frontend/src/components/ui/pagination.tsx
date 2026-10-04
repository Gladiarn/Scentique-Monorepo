import Link from "next/link";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  pageCount: number;
  /** Server-navigated pages: each page is a link. */
  hrefFor?: (page: number) => string;
  /** Client-held pages: each page is a button. */
  onPage?: (page: number) => void;
  label: string;
}

const control = "inline-flex h-10 items-center rounded-pill border border-ink/25 px-5 text-sm transition-colors hover:border-accent hover:text-accent aria-disabled:pointer-events-none aria-disabled:opacity-40";

/** Previous, page position, next. Hidden when everything fits on one page. */
export function Pagination({ page, pageCount, hrefFor, onPage, label }: PaginationProps) {
  if (pageCount <= 1) return null;
  const go = (target: number, text: string) => {
    const disabled = target < 1 || target > pageCount;
    if (hrefFor) {
      return (
        <Link href={hrefFor(target)} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined} className={control}>
          {text}
        </Link>
      );
    }
    return (
      <button type="button" disabled={disabled} onClick={() => onPage?.(target)} className={cn(control, "disabled:pointer-events-none disabled:opacity-40")}>
        {text}
      </button>
    );
  };

  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-4">
      {go(page - 1, "Previous")}
      <p className="text-sm tabular-nums text-muted" aria-current="page">
        Page {page} of {pageCount}
      </p>
      {go(page + 1, "Next")}
    </nav>
  );
}
