import type { ReactNode } from "react";
import "./globals.css";
import Header from "./components/Header"; // změněno z ../components/Header

export const metadata = {
  title: "Pan Batoh",
  description: "Portál průvodců a cestovatelů",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}