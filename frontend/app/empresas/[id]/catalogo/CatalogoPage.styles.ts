import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: #12121f;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin: 2rem 2rem 1.5rem 2rem;

  &:hover {
    color: #cbd5e0;
  }
`;

export const MainContent = styled.main`
  padding: 0 2.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const EmpresaNome = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const PrimaryButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: #6d28d9;
  }
`;

export const FiltersCard = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  margin-bottom: 1.5rem;
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
`;

export const SelectInput = styled.select`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  font-size: 0.9rem;
  background: #1a1a2e;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
`;

export const TableCard = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

export const TableHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border: 1px solid #2d2d4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.div`
  display: flex;
  flex-direction: column;

  span:first-child {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  span:last-child {
    font-size: 0.8rem;
    color: #6b7280;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const Thead = styled.thead`
  background: #12121f;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1.5rem;
  color: #6b7280;
  font-weight: 500;
  border: 1px solid #2d2d4e;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:hover {
    background: #12121f;
  }
`;

export const Td = styled.td`
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #1e1e3a;
  color: #111827;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #6d28d9;
  font-size: 0.75rem;
`;

export const SecondaryButton = styled.button`
  background: #1a1a2e;
  border-radius: 999px;
  border: 1px solid #2d2d4e;
  color: #cbd5e0;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 0.25rem;

  &:hover {
    background: #12121f;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  font-size: 0.9rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const DangerButton = styled.button`
  background: #ef4444;
  color: white;
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;
