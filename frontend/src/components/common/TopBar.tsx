"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import NotificationBell from "./NotificationBell";
import { MdExpandMore } from "react-icons/md";

// Estilos da TopBar
const TopBarContainer = styled.header`
  background: #12121f;
  border-bottom: 1px solid #2d2d4e;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #8b5cf6;
  cursor: pointer;
  background-color: transparent;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &:hover {
    background-color: rgba(139, 92, 246, 0.1);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(139, 92, 246, 0.15);
  }
`;

const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #e2e8f0;
  border: 2px solid rgba(139, 92, 246, 0.6);
`;

const ExpandIcon = styled.div<{ $isOpen: boolean }>`
  color: rgba(160, 174, 192, 0.85);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserDropdown = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  min-width: 240px;
  z-index: 1000;
  display: ${(props) => (props.$show ? "block" : "none")};
  overflow: hidden;
`;

const UserDropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #2d2d4e;
  background: #12121f;
`;

const UserDropdownName = styled.div`
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const UserDropdownRole = styled.div`
  font-size: 0.75rem;
  color: #a0aec0;
  margin-bottom: 0.25rem;
`;

const UserDropdownEmail = styled.div`
  font-size: 0.75rem;
  color: #718096;
`;

const UserDropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #a0aec0;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2d2d4e;
    color: #e2e8f0;
  }

  &:last-child {
    border-top: 1px solid #2d2d4e;
    color: #f87171;

    &:hover {
      background: #3b1a1a;
      color: #f87171;
    }
  }
`;

interface User {
  nome: string;
  funcao: string;
  email?: string;
}

export default function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("kaoskampf_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const getInitials = (nome: string) => {
    const names = nome.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("kaoskampf_token");
    localStorage.removeItem("kaoskampf_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie =
      "kaoskampf-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const handleLogoClick = () => {
    router.push("/painel");
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    router.push("/perfil");
  };

  return (
    <TopBarContainer>
      <Logo onClick={handleLogoClick}>KaosKampf</Logo>

      <RightSection>
        <NotificationBell />

        <UserMenuContainer ref={userMenuRef}>
          <UserAvatar onClick={() => setShowUserMenu(!showUserMenu)}>
            <AvatarCircle>{user ? getInitials(user.nome) : "US"}</AvatarCircle>
            <ExpandIcon $isOpen={showUserMenu}>
              <MdExpandMore />
            </ExpandIcon>
          </UserAvatar>

          <UserDropdown $show={showUserMenu}>
            <UserDropdownHeader>
              <UserDropdownName>{user?.nome || "Usuário"}</UserDropdownName>
              <UserDropdownRole>{user?.funcao || "Função"}</UserDropdownRole>
              {user?.email && (
                <UserDropdownEmail>{user.email}</UserDropdownEmail>
              )}
            </UserDropdownHeader>

            <UserDropdownItem onClick={handleProfileClick}>
              Perfil
            </UserDropdownItem>

            <UserDropdownItem onClick={handleLogout}>Sair</UserDropdownItem>
          </UserDropdown>
        </UserMenuContainer>
      </RightSection>
    </TopBarContainer>
  );
}
