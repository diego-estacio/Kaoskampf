import styled from "styled-components";

export const ViewToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a2e;
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: ${(props) => (props.$active ? "#8b5cf6" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#a0aec0")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#8b5cf6" : "#1e1e3a")};
    color: ${(props) => (props.$active ? "white" : "#8b5cf6")};
  }
`;
