"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../src/stores/authStore";
import {
  AuthCard,
  Logo,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  LoginLink,
  ErrorMessage,
} from "../../src/styles/auth.styles";
import FractalBackground, { FractalState } from "./FractalBackground";

interface FormData {
  loginOrEmail: string;
  senha: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fractalState, setFractalState] = useState<FractalState>("chaos");
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState<FormData>({
    loginOrEmail: "",
    senha: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const login = formData.loginOrEmail.trim();
    if (!login) {
      setError("Login ou email é obrigatório");
      return false;
    }
    if (login.length > 254) {
      setError("Login muito longo");
      return false;
    }
    if (!formData.senha) {
      setError("Senha é obrigatória");
      return false;
    }
    if (formData.senha.length > 128) {
      setError("Senha muito longa");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(formData.loginOrEmail, formData.senha);
      setFractalState("organizing");
      setTimeout(() => {
        window.location.href = "/atividades";
      }, 1600);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Erro ao fazer login. Tente novamente.",
      );
      setFractalState("panic");
      setTimeout(() => setFractalState("chaos"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FractalBackground state={fractalState} />

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          zIndex: 1,
        }}
      >
        <AuthCard
          style={{
            background: "rgba(18, 18, 31, 0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            boxShadow:
              "0 25px 60px rgba(125, 119, 158, 0.05), 0 0 40px rgba(139,92,246,0.08)",
          }}
        >
          <Logo>
            <h1>KaosKampf</h1>
            <p>Faça login na sua conta</p>
          </Logo>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="loginOrEmail">Login ou Email</Label>
              <Input
                id="loginOrEmail"
                name="loginOrEmail"
                type="text"
                placeholder="seu@email.com ou seu_login"
                value={formData.loginOrEmail}
                onChange={handleInputChange}
                autoComplete="username"
                required
              />
            </FormGroup>

            <FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Label htmlFor="senha">Senha</Label>
                <a
                  href="/login/esqueci-senha"
                  style={{
                    fontSize: "0.75rem",
                    color: "#8b5cf6",
                    textDecoration: "none",
                  }}
                >
                  Esqueci minha senha
                </a>
              </div>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Sua senha"
                value={formData.senha}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Entrando..."
                : fractalState === "organizing"
                  ? "Bem-vindo!"
                  : "Entrar"}
            </Button>
          </Form>

          <LoginLink>
            Nao tem uma conta? <a href="/cadastro">Criar conta</a>
          </LoginLink>
        </AuthCard>
      </div>
    </>
  );
}
