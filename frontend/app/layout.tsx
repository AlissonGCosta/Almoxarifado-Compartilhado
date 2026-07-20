import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almoxarifado Compartilhado",
  description: "Gestão municipal de bens e materiais compartilhados",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
  },
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
