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

  &:hover {
    color: #cbd5e0;
  }
  cursor: pointer;
  margin: 2rem 2rem 1.5rem 2rem;
  transition: background 0.2s ease;
`;

export const MainContent = styled.main`
  padding: 0 2.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  min-height: calc(100vh - 120px);
`;

export const EmpresaSection = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const ContatosSection = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const EditButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  color: #718096;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #12121f;
    color: #3b82f6;
  }
`;

export const EmpresaHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

export const EmpresaLogo = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  margin-right: 1.5rem;
`;

export const EmpresaInfo = styled.div`
  flex: 1;
`;

export const EmpresaNome = styled.h1`
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 1.875rem;
`;

export const EmpresaPorte = styled.span<{ $porte: string }>`
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$porte) {
      case "grande":
        return "#dcfce7";
      case "media":
        return "#fef3c7";
      case "pequena":
        return "#e0e7ff";
      default:
        return "#1e1e3a";
    }
  }};
  color: ${(props) => {
    switch (props.$porte) {
      case "grande":
        return "#166534";
      case "media":
        return "#92400e";
      case "pequena":
        return "#3730a3";
      default:
        return "#a0aec0";
    }
  }};
`;

export const EmpresaDetails = styled.div`
  display: grid;
  gap: 1rem;
`;

export const DetailRow = styled.div`
  display: flex;
  gap: 2rem;
  align-items: start;
`;

export const DetailLabel = styled.div`
  color: #718096;
  font-weight: 500;
  font-size: 0.875rem;
`;

export const DetailValue = styled.div`
  min-width: 200px;
  color: #e2e8f0;
  font-weight: 400;
`;

export const ContatosGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const ContatoCard = styled.div`
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
`;

export const ContatoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const ContatoNome = styled.h4`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
`;

export const ContatoCargo = styled.p`
  color: #718096;
  margin: 0;
  font-size: 0.875rem;
`;

export const ContatoStatus = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$status) {
      case "quente":
        return "#fef3c7";
      case "morno":
        return "#ddd6fe";
      case "frio":
        return "#3d1515";
      default:
        return "#1e1e3a";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "quente":
        return "#92400e";
      case "morno":
        return "#5b21b6";
      case "frio":
        return "#991b1b";
      default:
        return "#a0aec0";
    }
  }};
`;

export const ContatoInfo = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

// Estilos para o modal de contato detalhado
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ModalLeft = styled.div`
  padding: 2rem;
  border: 1px solid #2d2d4e;
`;

export const ModalRight = styled.div`
  padding: 2rem;
  background: #12121f;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const CloseButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  color: #718096;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;

  &:hover {
    background: #1a1a2e;
    color: #e2e8f0;
  }
`;

export const ContatoForm = styled.form`
  display: grid;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #cbd5e0;
`;

export const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[disabled] {
    background: #12121f;
    color: #6b7280;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[disabled] {
    background: #12121f;
    color: #6b7280;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #8b5cf6;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #1e1e3a;
  color: #cbd5e0;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #2d2d4e;
  }
`;

export const NotesSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const NotesHeader = styled.div`
  margin-bottom: 1rem;
`;

export const NotesTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
`;

export const NotesArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 1px solid #2d2d4e;
  border-radius: 6px;
  font-size: 0.875rem;
  resize: none;
  min-height: 300px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;
