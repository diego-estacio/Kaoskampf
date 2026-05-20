"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, NavLinks, NavLink } from "./Layout.styles";
import { useAuthStore } from "../../stores/authStore";

interface NavigationProps {
  activeTab?: string;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const router = useRouter();
  const [contatosOpen, setContatosOpen] = useState(false);
  const usuario = useAuthStore((state) => state.usuario);

  const isAdmin = (() => {
    if (!usuario || !usuario.role) return false;
    const raw = usuario.role.toUpperCase();
    return ["ADMIN", "MASTER"].includes(raw);
  })();

  const isMaster = usuario?.role?.toUpperCase() === "MASTER";
  const handleNavigation = (tab: string) => {
    switch (tab) {
      case "timeline":
        router.push("/atividades");
        break;
      case "clientes":
        router.push("/empresas");
        break;
      case "contatos":
        setContatosOpen((prev) => !prev);
        break;
      case "contatosLeads":
        router.push("/contatos/leads");
        break;
      case "contatosClientes":
        router.push("/contatos/clientes");
        break;
      case "catalogo":
        router.push("/catalogo");
        break;
      case "propostas":
        router.push("/propostas");
        break;
      case "notas":
        router.push("/notas");
        break;
      case "perfil":
        router.push("/perfil");
        break;
      case "usuarios":
        router.push("/usuarios");
        break;
      case "admin":
        router.push("/admin/usuarios");
        break;
    }
  };

  return (
    <Sidebar>
      <NavLinks>
        <NavLink
          $active={activeTab === "timeline"}
          onClick={() => handleNavigation("timeline")}
        >
          Timeline
        </NavLink>
        <NavLink
          $active={activeTab === "clientes"}
          onClick={() => handleNavigation("clientes")}
        >
          Empresas
        </NavLink>
        <NavLink
          $active={
            activeTab === "contatosLeads" || activeTab === "contatosClientes"
          }
          onClick={() => handleNavigation("contatos")}
        >
          Contatos
        </NavLink>
        {contatosOpen && (
          <>
            <NavLink
              className="contacts"
              $active={activeTab === "contatosLeads"}
              onClick={() => handleNavigation("contatosLeads")}
            >
              - Leads
            </NavLink>
            <NavLink
              className="contacts"
              $active={activeTab === "contatosClientes"}
              onClick={() => handleNavigation("contatosClientes")}
            >
              - Clientes
            </NavLink>
          </>
        )}
        <NavLink
          className="catalog"
          $active={activeTab === "catalogo"}
          onClick={() => handleNavigation("catalogo")}
        >
          Catálogo
        </NavLink>
        <NavLink
          className="proposals"
          $active={activeTab === "propostas"}
          onClick={() => handleNavigation("propostas")}
        >
          Propostas
        </NavLink>
        <NavLink
          className="notas"
          $active={activeTab === "notas"}
          onClick={() => handleNavigation("notas")}
        >
          Notas
        </NavLink>
        {isAdmin && (
          <NavLink
            $active={activeTab === "usuarios"}
            onClick={() => handleNavigation("usuarios")}
          >
            Usuários
          </NavLink>
        )}
        {isMaster && (
          <NavLink
            $active={activeTab === "admin"}
            onClick={() => handleNavigation("admin")}
          >
            Admin
          </NavLink>
        )}
      </NavLinks>
    </Sidebar>
  );
}
