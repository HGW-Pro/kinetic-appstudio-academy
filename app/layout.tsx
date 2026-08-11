import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "Kinetic AppStudio Academy",
  description:
    "The premium internal training portal for mastering Epicor Kinetic Application Studio — lessons, hands-on labs, and knowledge-check assignments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-center text-xs text-[var(--text-lo)] sm:px-6 lg:px-8">
          Kinetic AppStudio Academy · Built for engineers who ship real Epicor customizations.
        </footer>
      </body>
    </html>
  );
}
