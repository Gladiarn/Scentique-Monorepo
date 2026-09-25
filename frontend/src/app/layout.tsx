import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scentique",
  description: "Small-batch perfumes made with rare ingredients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
