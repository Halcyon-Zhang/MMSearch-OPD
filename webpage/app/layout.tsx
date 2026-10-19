import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(`https://jiepengzhou.github.io${basePath || "/"}`),
  title: "MMSearch-OPD — Easy Made Hard, Hard Made Learnable",
  description:
    "Controllable data refinement with joint reinforcement learning and on-policy distillation for long-horizon multimodal search agents.",
  openGraph: {
    title: "MMSearch-OPD",
    description:
      "Easy Made Hard, Hard Made Learnable for Long-Horizon Multimodal Search Agents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
