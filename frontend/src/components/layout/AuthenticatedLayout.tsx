"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "../common/Navigation";
import TopBar from "../common/TopBar";
import NotasFAB from "../common/NotasFAB";
import { useAuthStore } from "../../stores/authStore";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0f0f1a;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  margin-top: 60px; /* Espaço para TopBar fixo */
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 220px; /* Espaço para Sidebar fixo */
  min-height: calc(100vh - 60px);
`;

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// Rotas públicas que NÃO devem mostrar a sidebar/topbar
const publicRoutes = ["/", "/login", "/cadastro"];

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hydrateFromLegacyStorage = useAuthStore(
    (state) => state.hydrateFromLegacyStorage,
  );

  useEffect(() => {
    // Hidratar store a partir do legacy localStorage, se necessário
    hydrateFromLegacyStorage();

    // Verificar autenticação via token
    const token = localStorage.getItem("kaoskampf_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, [pathname]);

  // Verificar se é uma rota pública
  const isProposalVisualizacaoRoute =
    pathname?.includes("/propostas/") && pathname?.includes("/visualizar");

  const isPublicRoute =
    publicRoutes.some(
      (route) => pathname === route || pathname?.startsWith("/cadastro"),
    ) || isProposalVisualizacaoRoute;

  // Se está carregando, não renderiza nada ainda
  if (isLoading) {
    return <>{children}</>;
  }

  // Se é rota pública OU não está autenticado, renderiza sem sidebar
  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  // Extrair activeTab do pathname
  const getActiveTab = () => {
    if (pathname?.includes("/painel")) return "dashboard";
    if (pathname?.includes("/atividades")) return "timeline";
    if (pathname?.includes("/projetos")) return "projetos";
    if (pathname?.includes("/empresas")) return "clientes";
    if (pathname?.includes("/contatos/leads")) return "contatosLeads";
    if (pathname?.includes("/contatos/clientes")) return "contatosClientes";
    if (pathname?.includes("/contatos")) return "contatosLeads";
    if (pathname?.includes("/admin")) return "admin";
    if (pathname?.includes("/usuarios")) return "usuarios";
    if (pathname?.includes("/perfil")) return "perfil";
    return "";
  };

  // Renderiza com TopBar + Sidebar para rotas autenticadas
  return (
    <AppContainer>
      <TopBar />
      <MainLayout>
        <Navigation activeTab={getActiveTab()} />
        <ContentWrapper>{children}</ContentWrapper>
      </MainLayout>
      <NotasFAB />
    </AppContainer>
  );
}
