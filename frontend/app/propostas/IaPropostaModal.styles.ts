import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const recording = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: var(--color-bg-secondary, #1e1e2e);
  border-radius: 16px;
  width: 90%;
  max-width: 720px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: ${slideUp} 0.3s ease-out;
  border: 1px solid var(--color-border, #2e2e3e);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #2e2e3e);
`;

export const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #2d2d4e);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-tertiary, #9ca3af);
  line-height: 1;
  &:hover {
    color: var(--color-text-primary, #2d2d4e);
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border, #2e2e3e);
  background: var(--color-bg-primary, #121218);
  color: var(--color-text-primary, #2d2d4e);
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--color-btn-primary, #6366f1);
  }
  &::placeholder {
    color: var(--color-text-tertiary, #6b7280);
  }
`;

export const GenerateButton = styled.button`
  align-self: flex-end;
  background: var(--color-btn-primary, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
`;

export const LoadingDots = styled.div`
  font-size: 1.5rem;
  color: var(--color-btn-primary, #6366f1);
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ResultLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary, #9ca3af);
  font-weight: 600;
`;

export const ResultValue = styled.div`
  font-size: 0.9rem;
  color: var(--color-text-primary, #2d2d4e);
  background: var(--color-bg-primary, #121218);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border, #2e2e3e);
  line-height: 1.5;
`;

export const ItemCard = styled.div`
  background: var(--color-bg-primary, #121218);
  border: 1px solid var(--color-border, #2e2e3e);
  border-left: 3px solid var(--color-btn-primary, #6366f1);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ItemName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary, #2d2d4e);
`;

export const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-secondary, #9ca3af);
`;

export const ItemJustificativa = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-tertiary, #6b7280);
  font-style: italic;
  margin-top: 0.25rem;
`;

export const Observacoes = styled.div`
  font-size: 0.85rem;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(251, 191, 36, 0.2);
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border, #2e2e3e);
`;

export const CancelButton = styled.button`
  background: transparent;
  color: var(--color-text-secondary, #9ca3af);
  border: 1px solid var(--color-border, #2e2e3e);
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    border-color: var(--color-text-tertiary, #6b7280);
  }
`;

export const ApplyButton = styled.button`
  background: var(--color-success, #22c55e);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  background: rgba(239, 68, 68, 0.08);
  border-radius: 6px;
`;

export const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const VoiceButton = styled.button<{ $isRecording?: boolean }>`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $isRecording }) =>
    $isRecording ? "#ef4444" : "var(--color-bg-primary, #121218)"};
  color: ${({ $isRecording }) =>
    $isRecording ? "white" : "var(--color-text-tertiary, #6b7280)"};
  border: 1px solid
    ${({ $isRecording }) =>
      $isRecording ? "#ef4444" : "var(--color-border, #2e2e3e)"};
  animation: ${({ $isRecording }) =>
    $isRecording ? recording : "none"} 1.5s ease-in-out infinite;

  &:hover {
    color: ${({ $isRecording }) =>
      $isRecording ? "white" : "var(--color-text-primary, #2d2d4e)"};
    border-color: ${({ $isRecording }) =>
      $isRecording ? "#ef4444" : "var(--color-text-tertiary, #6b7280)"};
  }
`;

export const VoiceHint = styled.div`
  font-size: 0.75rem;
  color: #ef4444;
  text-align: right;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
