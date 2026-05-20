import styled from "styled-components";

export const ProfessionalSection = styled.div`
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

export const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 1px solid #2d2d4e;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const NotificationSection = styled.div`
  background: #1a1506;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  margin-bottom: 1.5rem;
`;

export const NotificationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #8b5cf6;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #cbd5e0;
  cursor: pointer;
  user-select: none;
`;

export const FrequencyGroup = styled.div`
  margin-top: 1rem;
`;

export const FrequencyOptions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

export const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #8b5cf6;
  cursor: pointer;
`;

export const RadioLabel = styled.label`
  font-size: 0.875rem;
  color: #cbd5e0;
  cursor: pointer;
  user-select: none;
`;
