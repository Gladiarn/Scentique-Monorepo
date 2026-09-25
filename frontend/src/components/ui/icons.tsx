import type { SVGProps } from "react";

/* One hairline set: 24px grid, 1.25 stroke, round caps. Thin, to match the logo's line weight. */
function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

type P = SVGProps<SVGSVGElement>;

export const ArrowRightIcon = (p: P) => (
  <Icon {...p}><path d="M4 12h15M14 7l5 5-5 5" /></Icon>
);
export const SearchIcon = (p: P) => (
  <Icon {...p}><circle cx="11" cy="11" r="6.25" /><path d="m20 20-4.4-4.4" /></Icon>
);
export const UserIcon = (p: P) => (
  <Icon {...p}><circle cx="12" cy="8.25" r="3.75" /><path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" /></Icon>
);
export const BagIcon = (p: P) => (
  <Icon {...p}><path d="M5.5 8.5h13l-.9 11.25H6.4L5.5 8.5Z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></Icon>
);
export const MenuIcon = (p: P) => (
  <Icon {...p}><path d="M4 8h16M4 16h16" /></Icon>
);
export const CloseIcon = (p: P) => (
  <Icon {...p}><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></Icon>
);
export const ChevronDownIcon = (p: P) => (
  <Icon width="14" height="14" {...p}><path d="m6 9.5 6 6 6-6" /></Icon>
);
export const ChevronLeftIcon = (p: P) => (
  <Icon {...p}><path d="m14.5 6-6 6 6 6" /></Icon>
);
export const ChevronRightIcon = (p: P) => (
  <Icon {...p}><path d="m9.5 6 6 6-6 6" /></Icon>
);
export const DropIcon = (p: P) => (
  <Icon {...p}><path d="M12 3.5c3.2 4 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.3-6 5.5-10Z" /></Icon>
);
export const HourglassIcon = (p: P) => (
  <Icon {...p}><path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 4 5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5-4 8.5s4 4.5 4 8.5" /></Icon>
);
export const BottleIcon = (p: P) => (
  <Icon {...p}><path d="M10 3.5h4v3h-4zM8.5 9.5A2.5 2.5 0 0 1 11 7h2a2.5 2.5 0 0 1 2.5 2.5V19a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 19V9.5Z" /></Icon>
);
