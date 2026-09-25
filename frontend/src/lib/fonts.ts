import { Gilda_Display, Hanken_Grotesk } from "next/font/google";

/* Chosen pair (design-log.md): Gilda Display for headlines, Hanken Grotesk for everything else. */
const display = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-display-face", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

export const fontVariables = `${display.variable} ${body.variable}`;
