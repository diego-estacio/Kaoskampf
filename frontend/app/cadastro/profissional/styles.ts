import styled from "styled-components";

export const NotificationSection = styled.div`
  background: #12121f;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #2d2d4e;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #cbd5e0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #8b5cf6;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: #cbd5e0;
  cursor: pointer;
  user-select: none;
`;

export const NumberInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const NumberButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #2d2d4e;
  background: #12121f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2d2d4e;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NumberInput = styled.input`
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #2d2d4e;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;
