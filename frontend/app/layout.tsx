import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../src/lib/registry";
import AuthenticatedLayout from "../src/components/layout/AuthenticatedLayout";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KaosKampf - Sistema de Gerenciamento",
  description: "Gerencie seus clientes, contatos e projetos com o KaosKampf",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
          <Toaster position="bottom-right" reverseOrder={false} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
