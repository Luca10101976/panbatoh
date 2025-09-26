import type { Metadata } from "next";
import "./globals.css";

import { SupabaseAuthProvider } from "../components/SupabaseProvider";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Pan Batoh",
  description: "Objevuj s průvodci – Pan Batoh",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head />
      <body className="bg-[#F5F5F5] text-[#333333] font-sans antialiased">
        <SupabaseAuthProvider>
          {/* Hlavička webu */}
          <Header />

          {/* Obsah stránky */}
          <main className="min-h-screen">{children}</main>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}