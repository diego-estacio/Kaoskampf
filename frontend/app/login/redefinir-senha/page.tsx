"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthContainer,
  AuthCard,
  Logo,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
} from "../../../src/styles/auth.styles";

import { apiService } from "../../../src/services/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    senha: "",
    confirmarSenha: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token de recuperação inválido ou expirado.");
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await apiService.redefinirSenha(token, formData.senha);
      setSuccess(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Ocorreu um erro ao redefinir sua senha. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <AuthContainer>
        <AuthCard>
          <Logo>
            <h1>KaosKampf</h1>
            <p>Link Inválido</p>
          </Logo>
          <ErrorMessage>
            Este link de recuperação é inválido ou já expirou. Por favor,
            solicite uma nova recuperação.
          </ErrorMessage>
          <Button
            style={{ marginTop: "1.5rem" }}
            onClick={() => router.push("/login/esqueci-senha")}
          >
            Solicitar Novo Link
          </Button>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthCard>
        <Logo>
          <h1>KaosKampf</h1>
          <p>Crie sua nova senha</p>
        </Logo>

        {!success ? (
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="senha">Nova Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? "Redefinindo..." : "Alterar Senha"}
            </Button>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <SuccessMessage>
              Senha alterada com sucesso! Você será redirecionado para o login
              em instantes.
            </SuccessMessage>
            <Button
              style={{ marginTop: "1.5rem" }}
              onClick={() => router.push("/login")}
            >
              Ir para o Login
            </Button>
          </div>
        )}
      </AuthCard>
    </AuthContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthContainer>
          <AuthCard>
            <Logo>
              <h1>KaosKampf</h1>
              <p>Carregando...</p>
            </Logo>
          </AuthCard>
        </AuthContainer>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
