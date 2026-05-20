import styled from "styled-components";

// Componentes de formulário compartilhados
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #a0aec0;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #2d2d4e;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #12121f;
  color: #e2e8f0;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }

  &::placeholder {
    color: #4a5568;
  }
`;

export const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #2d2d4e;
  border-radius: 12px;
  font-size: 1rem;
  background: #12121f;
  color: #e2e8f0;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
`;

export const Button = styled.button<{ $variant?: "secondary" }>`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.$variant === "secondary"
      ? `
    background: #1a1a2e;
    color: #a0aec0;
    border: 2px solid #2d2d4e;
    
    &:hover {
      background: #2d2d4e;
      border-color: #8b5cf6;
      color: #e2e8f0;
    }
  `
      : `
    background: linear-gradient(135deg, #7c3aed, #8b5cf6);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px rgba(139, 92, 246, 0.2);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  ${Button} {
    flex: 1;
  }
`;

export const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
  font-size: 0.875rem;

  a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.div`
  background: #3b1a1a;
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  border: 1px solid #7f1d1d;
`;

export const SuccessMessage = styled.div`
  background: #064e3b;
  color: #6ee7b7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  border: 1px solid #065f46;
`;

// Componentes de container e layout
export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 100%);
`;

export const AuthCard = styled.div`
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  border: 1px solid #2d2d4e;
  width: 100%;
  max-width: 400px;
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #8b5cf6;
    margin-bottom: 0.5rem;
  }

  p {
    color: #a0aec0;
    font-size: 0.875rem;
  }
`;
