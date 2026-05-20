"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthContainer,
  AuthCard,
  Logo,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  LoginLink,
  ErrorMessage,
  SuccessMessage,
} from "../../../src/styles/auth.styles";

import { apiService } from "../../../src/services/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Por favor, informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      await apiService.esqueceuSenha(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Logo>
          <h1>KaosKampf</h1>
          <p>Recupere o acesso à sua conta</p>
        </Logo>

        {!success ? (
          <Form onSubmit={handleSubmit}>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              Digite seu e-mail abaixo e enviaremos instruções para criar uma
              nova senha.
            </p>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <SuccessMessage>
              E-mail enviado com sucesso! Verifique sua caixa de entrada e siga
              as instruções.
            </SuccessMessage>
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              Não recebeu o e-mail? Verifique a pasta de spam ou tente novamente
              em alguns minutos.
            </p>
          </div>
        )}

        <LoginLink>
          Lembrou a senha? <a href="/login">Voltar para o login</a>
        </LoginLink>
      </AuthCard>
    </AuthContainer>
  );
}
