"use client";

import { useState } from "react";
import {
  PageContainer,
  MainContent,
  PageHeader,
  HeaderContent,
  PageTitle,
  PageSubtitle,
} from "../../../../src/components/common/Layout.styles";
import { apiService } from "../../../../src/services/api";
import { useAuthStore } from "../../../../src/stores/authStore";

interface RecalculoResultado {
  total: number;
  atualizados: number;
}

export default function RecalcularLeadTipoPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const isMaster = usuario?.role?.toUpperCase() === "MASTER";

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<RecalculoResultado | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleRecalcular = async () => {
    if (!isMaster) return;

    setLoading(true);
    setResultado(null);
    setError(null);

    try {
      const data = await apiService.recalcularLeadETipoContato();
      setResultado(data);
    } catch (err: any) {
      console.error("Erro ao recalcular lead/tipo:", err);
      setError(
        err?.response?.data?.message ||
          "Erro ao executar o recálculo. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <PageContainer>
        <MainContent>
          <p>Você precisa estar logado para acessar esta página.</p>
        </MainContent>
      </PageContainer>
    );
  }

  if (!isMaster) {
    return (
      <PageContainer>
        <MainContent>
          <p>Apenas usuários MASTER podem executar esta ferramenta.</p>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <HeaderContent>
            <div>
              <PageTitle>Recalcular Lead e Tipo de Contato</PageTitle>
              <PageSubtitle>
                Ferramenta administrativa para alinhar a temperatura do lead
                (frio/morno/quente/inativo) e o tipo de contato (lead/cliente)
                com base no status atual.
              </PageSubtitle>
            </div>
          </HeaderContent>
        </PageHeader>

        <section
          style={{
            background: "white",
            borderRadius: 12,
            padding: "1.5rem 2rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            maxWidth: 640,
          }}
        >
          <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
            Esta ação vai percorrer todos os contatos, recalcular o campo
            <strong> lead</strong> a partir do status (CADASTRO, REUNIAO,
            PROPOSTA, ATENDIMENTO, INATIVO, REATIVADO) e garantir que, quando o
            status for <strong>ATENDIMENTO</strong>, o tipo de contato seja
            ajustado para <strong>CLIENTE</strong>.
          </p>

          <p
            style={{
              marginBottom: "1.5rem",
              color: "#b45309",
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              fontSize: 14,
            }}
          >
            Use com cuidado. Ideal para corrigir dados após alterações diretas
            via SQL ou migrações.
          </p>

          <button
            onClick={handleRecalcular}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: loading ? "#9ca3af" : "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: 9999,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            {loading ? "Executando..." : "Executar recálculo global"}
          </button>

          {error && (
            <p
              style={{
                marginTop: "1rem",
                color: "#ef4444",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                fontSize: 14,
              }}
            >
              {error}
            </p>
          )}

          {resultado && (
            <div
              style={{
                marginTop: "1.5rem",
                background: "#ecfdf5",
                border: "1px solid #6ee7b7",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                fontSize: 14,
                color: "#065f46",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Total de contatos:</strong> {resultado.total}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Registros atualizados:</strong> {resultado.atualizados}
              </p>
            </div>
          )}
        </section>
      </MainContent>
    </PageContainer>
  );
}
