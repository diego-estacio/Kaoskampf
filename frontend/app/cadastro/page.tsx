"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Button,
  LoginLink,
  ErrorMessage,
} from "../../src/styles/auth.styles";
import {
  RegisterContainer,
  RegisterCard,
  Logo,
  StepIndicator,
  Step,
  PasswordRequirements,
} from "./cadastro.styles";

interface FormData {
  login: string;
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export default function CadastroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    login: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.login.trim()) {
      setError("Login é obrigatório");
      return false;
    }

    if (formData.login.length < 3) {
      setError("Login deve ter pelo menos 3 caracteres");
      return false;
    }

    if (!formData.nome.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido");
      return false;
    }

    if (!formData.senha) {
      setError("Senha é obrigatória");
      return false;
    }

    if (formData.senha.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("Senhas não conferem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    // Salvar dados no localStorage para a próxima etapa (sem confirmarSenha)
    const dataToSave = {
      login: formData.login,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
    };
    localStorage.setItem("cadastroStep1", JSON.stringify(dataToSave));

    // Ir para a página de informações profissionais
    router.push("/cadastro/profissional");
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <h1>KaosKampf</h1>
          <p>Crie sua conta - Etapa 1 de 2</p>
        </Logo>

        <StepIndicator>
          <Step $active={true} $completed={false}>
            <div className="number">1</div>
            <div className="label">Informações básicas</div>
          </Step>
          <Step $active={false} $completed={false}>
            <div className="number">2</div>
            <div className="label">Informações profissionais</div>
          </Step>
        </StepIndicator>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="login">Login/Nome de usuário</Label>
            <Input
              id="login"
              name="login"
              type="text"
              placeholder="Seu nome de usuário"
              value={formData.login}
              onChange={handleInputChange}
              autoComplete="username"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              name="nome"
              type="text"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleInputChange}
              autoComplete="name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.senha}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <Input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
            />
          </FormGroup>

          <PasswordRequirements>
            <h4>Requisitos da senha:</h4>
            <ul>
              <li>Mínimo de 6 caracteres</li>
              <li>Recomendado: incluir números e símbolos</li>
              <li>Evite informações pessoais óbvias</li>
            </ul>
          </PasswordRequirements>

          <Button type="submit">
            Continuar para Informações Profissionais →
          </Button>
        </Form>

        <LoginLink>
          Já tem uma conta? <a href="/login">Fazer login</a>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
}
