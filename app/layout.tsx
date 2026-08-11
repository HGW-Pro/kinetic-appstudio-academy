import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Kinetic AppStudio Academy",
  description:
    "The internal training portal for mastering Epicor Kinetic Application Studio — lessons, hands-on labs, and knowledge-check assignments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-[var(--border)] py-8">
            <p className="mx-auto max-w-6xl px-4 text-center text-xs text-[var(--text-lo)] sm:px-6 lg:px-8">
              Kinetic AppStudio Academy · Built for engineers who ship real Epicor customizations.
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
