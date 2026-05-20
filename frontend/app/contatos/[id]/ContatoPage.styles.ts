import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin: 0 5%;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0;

  &:hover {
    color: var(--color-text-primary);
  }
`;

export const ContatoSection = styled.section`
  background: var(--color-bg-primary);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  padding: 2rem;
  height: fit-content;
`;

export const ObservacoesSection = styled.section`
  background: var(--color-bg-primary);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  padding: 2rem;
  min-height: 600px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

export const EditButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--color-primary-hover);
  }
`;

export const MarcarContatoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-lead-hot);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
export const ContatoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

export const ContatoLogo = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export const ContatoInfo = styled.div`
  flex: 1;
`;

export const ContatoNome = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
`;

export const ContatoCargo = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin: 0;
  font-weight: 500;
`;

export const ContatoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;

  &:last-child {
    border-bottom: none;
  }
`;
export const DetailLabel = styled.span`
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 100px;
  font-size: 0.875rem;
`;

export const DetailValue = styled.span`
  color: var(--color-text-primary);
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const StatusDropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
  }
`;

export const ObservacoesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-tertiary);
  }
`;

export const ObservacaoCard = styled.div`
  background: var(--color-bg-sidebar);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: 1rem;
`;

export const ObservacaoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  span {
    font-weight: 500;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
`;

export const ObservacaoData = styled.span`
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
`;

export const ObservacaoTexto = styled.p`
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.5;
`;

export const NovaObservacaoForm = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-bg-sidebar);
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
`;

export const ObservacaoInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  font-family: inherit;
  resize: none;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
  }

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

export const AddObservacaoButton = styled.button`
  background: var(--color-lead-hot);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    background: var(--color-border-medium);
    color: var(--color-text-tertiary);
    cursor: not-allowed;
  }
`;
