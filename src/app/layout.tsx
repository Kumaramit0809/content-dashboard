import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
export const metadata: Metadata = { title: "Content Dashboard", description: "News, movies and posts in one personal feed." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><Providers>{children}</Providers></body></html>);
}
