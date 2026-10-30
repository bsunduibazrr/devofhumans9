import type { Metadata, Viewport } from "next";
import { Geist_Mono, Onest, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const body = Onest({
  variable: "--font-body",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Даяаршил — давуу талууд",
  description: "Хүний хөгжил хичээл: Даяаршил ба түүний давуу талууд",
};

export const viewport: Viewport = {
  themeColor: "#07090e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
