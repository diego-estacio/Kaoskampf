import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 1.5rem;
  align-items: flex-start;
`;

export const UsersList = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  max-height: 600px;
  overflow-y: auto;
`;

export const UserRow = styled.button<{
  $selected?: boolean;
  $unauthorized?: boolean;
}>`
  width: 100%;
  text-align: left;
  border: 2px solid
    ${(props) =>
      props.$selected
        ? "#8b5cf6"
        : props.$unauthorized
          ? "#ef4444"
          : "transparent"};
  background: ${(props) =>
    props.$selected ? "#eff6ff" : props.$unauthorized ? "#fef2f2" : "transparent"};
  border-radius: 8px;
  padding: 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
 
  &:hover {
    background: ${(props) =>
      props.$selected ? "#2d1b6b" : props.$unauthorized ? "#3d1515" : "#1e1e3a"};
  }
`;

export const UserName = styled.span`
  font-weight: 600;
  color: #e2e8f0;
`;

export const UserMeta = styled.span`
  font-size: 0.8rem;
  color: #718096;
`;

export const DetailsCard = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  min-height: 260px;
`;

export const FieldLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

export const FieldValue = styled.div`
  font-size: 0.95rem;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const RoleSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  font-size: 0.9rem;
  color: #111827;
  background: #12121f;
`;

export const InfoText = styled.p`
  font-size: 0.85rem;
  color: #718096;
`;

export const Pill = styled.span<{ $unauthorized?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: ${(props) => (props.$unauthorized ? "#3d1515" : "#eff6ff")};
  color: ${(props) => (props.$unauthorized ? "#ef4444" : "#6d28d9")};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;
 
export const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  border: none;
`;
 
export const AuthorizeButton = styled(ActionButton)`
  background: #10b981;
  color: white;
 
  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;
 
export const RevokeButton = styled(ActionButton)`
  background: #1a1a2e;
  color: #a0aec0;
  border: 1px solid #2d2d4e;
 
  &:hover {
    background: #1e1e3a;
    color: #e2e8f0;
  }
`;
