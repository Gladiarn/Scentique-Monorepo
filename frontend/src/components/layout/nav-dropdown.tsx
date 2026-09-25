"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { NavChild } from "@/config/site";
import { cn } from "@/lib/cn";

interface NavDropdownProps {
  label: string;
  href: string;
  items: readonly NavChild[];
  active?: boolean;
  className?: string;
}

/** Hover, click and keyboard operable menu. Opens on hover for mouse users, toggles on click for everyone else. */
export function NavDropdown({ label, items, active, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedByHover = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        openedByHover.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 140);
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
            return;
          }
          setOpen((v) => !v);
        }}
        className={cn(
          "relative inline-flex cursor-pointer items-center gap-1.5 py-2 transition-colors hover:text-ink",
          active ? "text-ink" : "text-ink/80",
        )}
      >
        {label}
        <ChevronDownIcon className={cn("transition-transform duration-200", open && "rotate-180")} />
        {active && <span aria-hidden="true" className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-pill bg-accent" />}
      </button>

      {open && (
        <ul
          id={panelId}
          className="absolute left-1/2 top-full z-10 mt-3 w-56 -translate-x-1/2 rounded-lg border border-line bg-page/85 p-2 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.7)] backdrop-blur-glass"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  openedByHover.current = false;
                  setOpen(false);
                }}
                className="flex h-11 items-center gap-3 rounded-md px-3 text-sm text-ink/90 transition-colors hover:bg-raised hover:text-ink"
              >
                {item.family ? (
                  <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${item.family})` }} />
                ) : (
                  <span aria-hidden="true" className="size-2" />
                )}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
