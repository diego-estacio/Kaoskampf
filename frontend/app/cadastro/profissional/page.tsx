"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ENV } from "../../../src/config/env";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  ErrorMessage,
} from "../../../src/styles/auth.styles";
import {
  RegisterContainer,
  RegisterCard,
  Logo,
  StepIndicator,
  Step,
} from "../cadastro.styles";
import * as S from "./styles";

interface ProfessionalData {
  funcao: string;
  notificacoesAtivadas: boolean;
  diasAntesNotificacao: number;
}

interface Step1Data {
  login: string;
  nome: string;
  email: string;
  senha: string;
}

export default function ProfessionalInfoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [professionalData, setProfessionalData] = useState<ProfessionalData>({
    funcao: "",
    notificacoesAtivadas: true,
    diasAntesNotificacao: 1,
  });

  useEffect(() => {
    // Verificar se existe dados da etapa 1
    const step1 = localStorage.getItem("cadastroStep1");
    if (!step1) {
      // Se não existir, redirecionar para a primeira etapa
      router.push("/cadastro");
      return;
    }

    try {
      setStep1Data(JSON.parse(step1));
    } catch {
      router.push("/cadastro");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProfessionalData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      const numValue = parseInt(value) || 1;
      setProfessionalData((prev) => ({
        ...prev,
        [name]: Math.max(1, Math.min(30, numValue)),
      }));
    } else {
      setProfessionalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (field: keyof ProfessionalData, delta: number) => {
    if (field === "diasAntesNotificacao") {
      const newValue = Math.max(
        1,
        Math.min(30, professionalData.diasAntesNotificacao + delta),
      );
      setProfessionalData((prev) => ({ ...prev, [field]: newValue }));
    }
  };

  const handleBack = () => {
    router.push("/cadastro");
  };

  const validateForm = (): boolean => {
    if (!professionalData.funcao.trim()) {
      setError("Função é obrigatória");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!step1Data) {
      setError("Dados da primeira etapa não encontrados");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${ENV.API_URL}/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...step1Data,
          funcao: professionalData.funcao,
          notificacoesAtivadas: professionalData.notificacoesAtivadas,
          diasAntesNotificacao: professionalData.diasAntesNotificacao,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.removeItem("cadastroStep1"); // Limpar dados temporários
        router.push("/painel");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao criar conta");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!step1Data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Inter, sans-serif",
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{ color: "white", marginBottom: "16px", fontSize: "2.5rem" }}
          >
            Carregando...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <h1>KaosKampf</h1>
          <p>Informações profissionais - Etapa 2 de 2</p>
        </Logo>

        <StepIndicator>
          <Step $active={false} $completed={true}>
            <div className="number">✓</div>
            <div className="label">Informações básicas</div>
          </Step>
          <Step $active={true} $completed={false}>
            <div className="number">2</div>
            <div className="label">Informações profissionais</div>
          </Step>
        </StepIndicator>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="funcao">Função *</Label>
            <Input
              id="funcao"
              name="funcao"
              type="text"
              placeholder="Ex: Gerente de Vendas, Designer, Desenvolvedor..."
              value={professionalData.funcao}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <S.NotificationSection>
            <S.SectionTitle>🔔 Configurações de Notificação</S.SectionTitle>

            <S.CheckboxGroup>
              <S.Checkbox
                id="notificacoesAtivadas"
                name="notificacoesAtivadas"
                type="checkbox"
                checked={professionalData.notificacoesAtivadas}
                onChange={handleInputChange}
              />
              <S.CheckboxLabel htmlFor="notificacoesAtivadas">
                Ativar notificações
              </S.CheckboxLabel>
            </S.CheckboxGroup>

            {professionalData.notificacoesAtivadas && (
              <FormGroup>
                <Label>Notificar quantos dias antes do contato:</Label>
                <S.NumberInputGroup>
                  <S.NumberButton
                    type="button"
                    onClick={() =>
                      handleNumberChange("diasAntesNotificacao", -1)
                    }
                    disabled={professionalData.diasAntesNotificacao <= 1}
                  >
                    −
                  </S.NumberButton>
                  <S.NumberInput
                    type="number"
                    min="1"
                    max="30"
                    value={professionalData.diasAntesNotificacao}
                    onChange={(e) => handleInputChange(e)}
                    name="diasAntesNotificacao"
                  />
                  <S.NumberButton
                    type="button"
                    onClick={() =>
                      handleNumberChange("diasAntesNotificacao", 1)
                    }
                    disabled={professionalData.diasAntesNotificacao >= 30}
                  >
                    +
                  </S.NumberButton>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    dia{professionalData.diasAntesNotificacao !== 1 ? "s" : ""}
                  </span>
                </S.NumberInputGroup>
              </FormGroup>
            )}
          </S.NotificationSection>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={handleBack}>
              ← Voltar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </ButtonGroup>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
}
