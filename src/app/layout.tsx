// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers"; // použijeme náš Providers
import Header from "./components/Header";

export const metadata = {
  title: "Pan Batoh",
  description: "Portál průvodců a cestovatelů",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}