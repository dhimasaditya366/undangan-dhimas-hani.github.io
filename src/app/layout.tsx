import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { weddingConfig } from "@/config/wedding";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: `The Wedding of ${weddingConfig.groomName} & ${weddingConfig.brideName}`,
  description: `You are invited to the wedding of ${weddingConfig.groomFullName} and ${weddingConfig.brideFullName}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${jost.variable} font-sans antialiased text-forest overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
