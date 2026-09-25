import {
  Albert_Sans,
  Bellefair,
  Bodoni_Moda,
  Gilda_Display,
  Hanken_Grotesk,
} from "next/font/google";

/*
 * Candidate faces for the /design specimen. Once the pair is chosen (design-log.md),
 * this file shrinks to two exports bound to --font-display-face and --font-body-face.
 */
export const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda", display: "swap" });
export const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bodoni", display: "swap" });
export const bellefair = Bellefair({ subsets: ["latin"], weight: "400", variable: "--font-bellefair", display: "swap" });
export const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
export const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", display: "swap" });

export const fontVariables = [gilda, bodoni, bellefair, hanken, albert].map((f) => f.variable).join(" ");
