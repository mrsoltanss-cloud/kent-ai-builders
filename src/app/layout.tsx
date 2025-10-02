import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/providers/Session";

export const metadata: Metadata = { title: "KAB" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}
