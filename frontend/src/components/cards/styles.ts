import styled from "styled-components";

export const CardContainer = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const EmpresaLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

export const CardInfo = styled.div`
  flex: 1;
`;

export const CardTitle = styled.h3`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
`;

export const CardSubtitle = styled.p`
  color: #718096;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<{ $porte: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => statusUtils.getPorteColor(props.$porte).bg};
  color: ${(props) => statusUtils.getPorteColor(props.$porte).text};
`;

export const CardDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #1e1e3a;
`;

export const CardDetail = styled.div`
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
