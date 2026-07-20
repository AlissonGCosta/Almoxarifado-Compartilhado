import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almoxarifado Compartilhado",
  description: "Gestão municipal de bens e materiais compartilhados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
