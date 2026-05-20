import React from "react";
import styled from "styled-components";

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #cbd5e0;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #12121f;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  font-size: 1rem;
  background: #1a1a2e;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    color: white;
    border-color: transparent;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  `
      : `
    background: #1a1a2e;
    color: #cbd5e0;
    border-color: #2d2d4e;
    
    &:hover {
      background: #12121f;
    }
  `}
`;

interface ProfileFormProps {
  formData: {
    nome: string;
    login: string;
    email: string;
    funcao: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileForm({
  formData,
  onInputChange,
  onSubmit,
}: ProfileFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          name="nome"
          type="text"
          value={formData.nome}
          onChange={onInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="login">Login</Label>
        <Input
          id="login"
          name="login"
          type="text"
          value={formData.login}
          onChange={onInputChange}
          disabled
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="funcao">Função</Label>
        <Select
          id="funcao"
          name="funcao"
          value={formData.funcao}
          onChange={onInputChange}
        >
          <option value="Gerente">Gerente</option>
          <option value="Vendedor">Vendedor</option>
          <option value="Desenvolvedor">Desenvolvedor</option>
          <option value="Marketing">Marketing</option>
          <option value="Suporte">Suporte</option>
        </Select>
      </FormGroup>

      <ButtonGroup>
        <Button type="submit" $variant="primary">
          Salvar Alterações
        </Button>
      </ButtonGroup>
    </Form>
  );
}
