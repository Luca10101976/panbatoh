// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import Header from "./components/Header";
import { SupabaseAuthProvider } from "@/components/SupabaseProvider";

export const metadata = {
  title: "Pan Batoh",
  description: "Portál průvodců a cestovatelů",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <SupabaseAuthProvider>
          <Header />
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}