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
