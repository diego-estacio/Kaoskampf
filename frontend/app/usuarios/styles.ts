import styled from "styled-components";

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #718096;
`;

export const ErrorContainer = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #991b1b;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  background: #1a1a2e;
  min-width: 220px;

  svg {
    width: 16px;
    height: 16px;
    color: #718096;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #e2e8f0;

  &::placeholder {
    color: #718096;
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

export const RefreshButton = styled.button`
  background: transparent;
  color: #718096;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #12121f;
    border-color: #2d2d4e;
  }
`;

export const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const UserCard = styled.div<{ $autorizado?: boolean }>`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid
    ${(props) => (props.$autorizado === false ? "#ef4444" : "transparent")};
 
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${(props) =>
      props.$autorizado === false ? "#ef4444" : "transparent"};
  }
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

export const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const UserName = styled.h3`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  border-bottom: 1px solid #1e1e3a;
`;

export const UserRole = styled.p`
  color: #718096;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
`;

export const UserStatus = styled.span<{ $online: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${(props) => (props.$online ? "#10b981" : "#6b7280")};
`;

export const StatusDot = styled.div<{ $online: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$online ? "#10b981" : "#6b7280")};
`;

export const UserDetails = styled.div`
  margin-bottom: 1.5rem;
`;

export const UserDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  color: #718096;
`;

export const DetailValue = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

export const NotificationBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$active ? "#dcfce7" : "#3d1515")};
  color: ${(props) => (props.$active ? "#166534" : "#991b1b")};
`;

// View Toggle Styles
export const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
  background: #1a1a2e;
  padding: 0.25rem;
  border-radius: 8px;
`;

interface ViewButtonProps {
  $active: boolean;
}

export const ViewButton = styled.button<ViewButtonProps>`
  background: ${(props) => (props.$active ? "white" : "transparent")};
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$active ? "#8b5cf6" : "#a0aec0")};
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$active ? "0 1px 3px rgba(0, 0, 0, 0.12)" : "none"};

  &:hover {
    background: ${(props) => (props.$active ? "white" : "#e2e8f0")};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// List View Styles
export const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const UserListItem = styled.div<{ $autorizado?: boolean }>`
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid
    ${(props) => (props.$autorizado === false ? "#ef4444" : "#8b5cf6")};
  cursor: pointer;
  transition: all 0.2s ease;
 
  ${(props) =>
    props.$autorizado === false &&
    `
    border: 1px solid #ef4444;
    border-left: 4px solid #ef4444;
  `}
 
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(4px);
  }
`;

export const ListItemContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 120px 150px 120px;
  gap: 1rem;
  align-items: center;
`;

export const ListItemMain = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ListItemName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
`;

export const ListItemRole = styled.p`
  color: #718096;
  margin: 0;
  font-size: 0.8rem;
`;

export const ListItemDetail = styled.div`
  font-size: 0.85rem;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ListItemStatus = styled.span<{ $online: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: white;
  background: ${(props) => (props.$online ? "#10b981" : "#6b7280")};
  justify-self: center;
`;

export const ListItemDate = styled.div`
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
`;

export const ListItemNotification = styled.span<{ $active: boolean }>`
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  background: ${(props) => (props.$active ? "#dcfce7" : "#3d1515")};
  color: ${(props) => (props.$active ? "#166534" : "#991b1b")};
  justify-self: center;
`;
 
export const AuthorizeButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
 
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
 
  &:active {
    transform: translateY(0);
  }
 
  &:disabled {
    background: #718096;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
 
export const RevokeButton = styled(AuthorizeButton)`
  background: #1a1a2e;
  color: #a0aec0;
  border: 1px solid #2d2d4e;
 
  &:hover {
    background: #1e1e3a;
    color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;
 
export const ListAuthorizeButton = styled(AuthorizeButton)`
  margin-top: 0;
  width: auto;
  padding: 0.4rem 1rem;
`;
 
export const ListRevokeButton = styled(RevokeButton)`
  margin-top: 0;
  width: auto;
  padding: 0.4rem 1rem;
`;
