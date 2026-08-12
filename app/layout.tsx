import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";
import { AuthProvider } from "../components/AuthProvider";
import AppChrome from "../components/AppChrome";

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
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
