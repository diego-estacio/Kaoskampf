import styled from "styled-components";

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
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    color: #e2e8f0;
    background: #1a1a2e;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;

  &:hover {
    color: #e2e8f0;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-weight: 600;
  color: #cbd5e0;
  font-size: 0.875rem;
`;

export const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #12121f;
    color: #718096;
    cursor: not-allowed;
  }
`;

export const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  font-size: 1rem;
  background: #1a1a2e;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #12121f;
    color: #718096;
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #12121f;
    color: #718096;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export const SaveButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #718096;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CancelButton = styled.button`
  background: #1a1a2e;
  color: #718096;
  border: 1px solid #2d2d4e;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #12121f;
    border-color: #2d2d4e;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const StatusBadge = styled.div<{ $status: number }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  width: fit-content;
  ${(props) => {
    switch (props.$status) {
      case 2:
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 1:
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background: #1e1e3a;
          color: #a0aec0;
        `;
    }
  }}
`;

export const MarcasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  background: #12121f;
`;

export const MarcaChip = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  ${(props) =>
    props.$selected
      ? `
    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: #1a1a2e;
    color: #a0aec0;
    border-color: #2d2d4e;
    
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export const EmptyMarcas = styled.div`
  color: #718096;
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem;
`;

export const MarcasViewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const MarcaViewChip = styled.div`
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
`;
