import styled from "styled-components";
import { colors, spacing, shadows, zIndex } from "../../styles/theme";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.backgroundMain};
`;

export const Sidebar = styled.nav`
  width: 280px;
  background-color: ${colors.backgroundSidebar};
  border-right: 1px solid ${colors.gray200};
  box-shadow: ${shadows.sm};
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: ${zIndex.fixed};
  overflow-y: auto;
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray200};
  padding: ${spacing.lg} ${spacing["2xl"]};
  box-shadow: ${shadows.sm};
  position: sticky;
  top: 0;
  z-index: ${zIndex.sticky};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Content = styled.div`
  flex: 1;
  padding: ${spacing["2xl"]};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing["2xl"]} ${spacing.xl};
  border-bottom: 1px solid ${colors.gray200};

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.primary};
    margin-left: ${spacing.md};
  }
`;

export const NavMenu = styled.ul`
  padding: ${spacing.lg} 0;
`;

export const NavItem = styled.li<{ active?: boolean }>`
  margin: ${spacing.xs} ${spacing.lg};

  a {
    display: flex;
    align-items: center;
    padding: ${spacing.md} ${spacing.lg};
    border-radius: ${spacing.md};
    color: ${(props) => (props.active ? colors.primary : colors.gray700)};
    background-color: ${(props) =>
      props.active ? colors.primaryLight : "transparent"};
    font-weight: ${(props) => (props.active ? 600 : 500)};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props) =>
        props.active ? colors.primaryLight : colors.gray100};
      color: ${(props) => (props.active ? colors.primary : colors.gray900)};
    }

    .icon {
      margin-right: ${spacing.md};
      width: 20px;
      height: 20px;
    }
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: 600;
  font-size: 0.875rem;
`;

export const NotificationBell = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: ${spacing.sm};
  border-radius: 50%;
  color: ${colors.gray600};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.gray100};
    color: ${colors.gray900};
  }

  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: ${colors.error};
    color: ${colors.white};
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
