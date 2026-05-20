"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";
import {
  MdTimeline,
  MdPeople,
  MdDashboard,
  MdPerson,
  MdBusiness,
} from "react-icons/md";
import {
  Container,
  Sidebar,
  MainContent,
  Header,
  Content,
  Logo,
  NavMenu,
  NavItem,
  UserInfo,
  UserAvatar,
  NotificationBell,
} from "./Layout.styles";

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: "/dashboard", label: "Timeline", icon: <MdTimeline /> },
  { path: "/contatos", label: "Leads/Contatos", icon: <MdPeople /> },
  { path: "/projetos", label: "Projetos", icon: <MdDashboard /> },
  { path: "/perfil", label: "Perfil", icon: <MdPerson /> },
  { path: "/colaboradores", label: "Colaboradores", icon: <MdBusiness /> },
];

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { usuario, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <span>🎬</span>
          <h1>KaosKampf</h1>
        </Logo>

        <NavMenu>
          {menuItems.map((item) => (
            <NavItem key={item.path} active={pathname === item.path}>
              <Link href={item.path}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </NavItem>
          ))}
        </NavMenu>
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <h2>Sistema de Gerenciamento de Clientes</h2>
          </div>

          <UserInfo>
            <NotificationBell>
              🔔
              <span className="badge">3</span>
            </NotificationBell>

            <UserAvatar>{usuario ? getInitials(usuario.nome) : "U"}</UserAvatar>

            <div>
              <div style={{ fontWeight: 600 }}>
                {usuario?.nome || "Usuário"}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {usuario?.funcao || "Função"}
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                background: "none",
                border: 1px solid #2d2d4e",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Sair
            </button>
          </UserInfo>
        </Header>

        <Content>{children}</Content>
      </MainContent>
    </Container>
  );
}
