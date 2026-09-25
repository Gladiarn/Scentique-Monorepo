import { Bodoni_Moda, Hanken_Grotesk, Prata } from "next/font/google";

/*
 * Prata for headlines and bold text: a heavy, high-contrast serif close to the logo's lettering.
 * Hanken Grotesk for everything else, like the logo's fine sans tagline.
 */
const display = Prata({ subsets: ["latin"], weight: "400", variable: "--font-display-face", display: "swap" });
/* Italic accent for highlighted words in headlines, like the gold italic in the reference. */
const accent = Bodoni_Moda({ subsets: ["latin"], style: "italic", variable: "--font-accent-face", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

export const fontVariables = `${display.variable} ${accent.variable} ${body.variable}`;
