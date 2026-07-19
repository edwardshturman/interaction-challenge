import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const openRunde = localFont({
  src: [
    { path: "./fonts/OpenRunde-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenRunde-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/OpenRunde-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/OpenRunde-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-open-runde",
  display: "swap",
});

// Exposure is variable along a custom EXPO axis only (no wght axis),
// so it renders at a single weight.
const exposure = localFont({
  src: [
    { path: "./fonts/ExposureTrialVAR.ttf", weight: "400", style: "normal" },
    {
      path: "./fonts/ExposureTrialVAR-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-exposure",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poke",
  description: "Install recipes for Poke",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openRunde.variable} ${exposure.variable}`}>
      <body>{children}</body>
    </html>
  );
}
