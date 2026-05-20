import styled from "styled-components";

// Sidebar vertical (apenas navegação)
export const Sidebar = styled.nav`
  background: #12121f;
  border-right: 1px solid #2d2d4e;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 220px;
  height: calc(100vh - 60px);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.4);
  overflow-y: auto;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 900;
`;

// Manter TopNavBar para compatibilidade (agora é igual a Sidebar)
export const TopNavBar = styled(Sidebar)``;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b5cf6;
  padding: 0.5rem;
  text-align: center;
`;

export const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

export const NavLink = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: ${(props) => (props.$active ? "#8b5cf6" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#a0aec0")};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) => (props.$active ? "#7c3aed" : "#2d2d4e")};
    color: ${(props) => (props.$active ? "white" : "#e2e8f0")};
  }
  &.contacts {
    background: ${(props) => (props.$active ? "#7c3aed" : "transparent")};
    opacity: 0.8;
  }
`;

export const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #2d2d4e;
`;

export const UserInfo = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

export const UserName = styled.div`
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.875rem;
`;

export const UserRole = styled.div`
  font-size: 0.75rem;
  color: #a0aec0;
`;

export const LogoutButton = styled.button`
  padding: 0.75rem 1rem;
  border: 1px solid #2d2d4e;
  background: transparent;
  color: #a0aec0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #2d2d4e;
    border-color: #8b5cf6;
    color: #e2e8f0;
  }
`;

export const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  color: #a0aec0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 1rem;

  &:hover {
    background: #2d2d4e;
    color: #e2e8f0;
  }
`;

export const PageContainer = styled.div`
  background: #0f0f1a;
  flex: 1;
`;

export const MainContent = styled.main`
  padding: 2rem;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
`;

export const PageHeader = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  border: 1px solid #2d2d4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
`;

export const PageSubtitle = styled.p`
  color: #a0aec0;
  margin: 0;
`;

export const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #7c3aed;
  }
`;

export const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

export const BellIcon = styled.div<{ $hasNotifications?: boolean }>`
  font-size: 1.5rem;
  color: ${(props) =>
    props.$hasNotifications ? "#1a1a2e" : "rgba(255, 255, 255, 0.85)"};
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #1a1a2e;
  }
`;

export const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const NotificationDropdown = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

export const NotificationHeader = styled.div`
  padding: 1rem;
  border: 1px solid #2d2d4e;
  font-weight: 600;
  color: #e2e8f0;
`;

export const NotificationItem = styled.div<{ $urgent?: boolean }>`
  padding: 1rem;
  padding-right: 2.5rem;
  border-bottom: 1px solid #1e1e3a;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid ${(props) => (props.$urgent ? "#ef4444" : "#f59e0b")};
  position: relative;

  &:hover {
    background: #12121f;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DeleteNotificationButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

export const NotificationTitle = styled.div`
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
`;

export const NotificationMessage = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const NotificationTime = styled.div`
  color: #718096;
  font-size: 0.75rem;
`;

export const NoNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: #718096;
`;
