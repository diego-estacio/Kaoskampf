"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import ContactModal from "../../../src/components/modals/ContactModal";

import { mockData } from "../../../src/utils";
import { apiService } from "../../../src/services/api";
import {
  carregarContatos,
  Contato as ContatoType,
} from "../../../src/utils/contatosUtils";
import { LeadTemperatura, Marca } from "../../../src/types";
import {
  PageContainer,
  BackButton,
  MainContent,
  EmpresaSection,
  ContatosSection,
  SectionHeader,
  SectionTitle,
  EmpresaHeader,
  EmpresaLogo,
  EmpresaInfo,
  EmpresaNome,
  EmpresaPorte,
  EmpresaDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
  ContatosGrid,
  ContatoCard,
  ContatoHeader,
  ContatoNome,
  ContatoCargo,
  ContatoStatus,
  ContatoInfo,
} from "./EmpresaPage.styles";

interface Empresa {
  id: string; // Mudado para string para compatibilidade com backend
  nome: string;
  porte: string;
  site?: string;
  marcas?: Marca[]; // Array de marcas relacionadas
  observacoes: string;
  contatos: number;
  status: number;
}

interface Contato {
  id: string; // Mudado para string para compatibilidade com backend
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  observacoes: string;
  status: number;
  lead: string;
}

export default function EmpresaPage() {
  const router = useRouter();
  const params = useParams();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadContatosDoEmpresa = useCallback(async () => {
    try {
      // Buscar todos os contatos e filtrar pela empresa
      const todosContatos = await carregarContatos();
      const contatosDoEmpresa = todosContatos.filter(
        (c: ContatoType) => c.empresa?.nome === empresa?.nome,
      );

      // Mapear para o formato esperado pelo componente
      const contatosMapeados = contatosDoEmpresa.map((c: ContatoType) => ({
        id: c.id, // Manter como string (UUID do backend)
        nome: c.nome,
        empresa: c.empresa?.nome || "",
        cargo: c.cargo || "",
        email: c.contatos?.email || "",
        telefone: c.contatos?.telefone || "",
        observacoes: c.observacoes || "",
        status: parseInt(c.status.toString()),
        lead: c.leadTemperatura || "morno",
      }));

      setContatos(contatosMapeados);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      // Fallback para mock data se a empresa existir
      if (empresa) {
        const contatosDoEmpresa = mockData.contatos
          .filter((c) => c.empresa === empresa.nome)
          .map((c) => ({
            id: c.id.toString(), // Converter ID para string
            nome: c.nome,
            empresa: c.empresa,
            cargo: c.cargo,
            email: c.email,
            telefone: c.telefone,
            observacoes: c.observacoes,
            status: c.status,
            lead: c.lead,
          }));
        setContatos(contatosDoEmpresa);
      }
    }
  }, [empresa]);

  useEffect(() => {
    const empresaId = params.id as string;
    loadEmpresaData(empresaId);
    loadContatosDoEmpresa();
  }, [params.id, loadContatosDoEmpresa]);

  const loadEmpresaData = async (empresaId: string) => {
    try {
      // Tentar buscar do backend
      const empresas = await apiService.buscarEmpresas();
      const empresaEncontrado = empresas.find((c: any) => c.id === empresaId);

      if (empresaEncontrado) {
        setEmpresa({
          id: empresaId, // Usar o ID como string
          nome: empresaEncontrado.nome,
          porte: empresaEncontrado.porte,
          site: empresaEncontrado.site || "",
          marcas: empresaEncontrado.marcas || [], // Array de marcas relacionadas
          observacoes: empresaEncontrado.observacoes || "",
          contatos: empresaEncontrado.contatos?.length || 0,
          status: empresaEncontrado.status || 0,
        });
      } else {
        // Fallback para mock data
        const empresaIdNum = parseInt(empresaId);
        const empresaMock = mockData.empresas.find(
          (e) => e.id === empresaIdNum,
        );
        if (empresaMock) {
          setEmpresa({
            id: empresaId,
            nome: empresaMock.nome,
            porte: empresaMock.porte,
            site: empresaMock.site,
            marcas: [], // Mock tem string, mas Empresa espera Marca[]
            observacoes: empresaMock.observacoes,
            contatos: empresaMock.contatos,
            status: empresaMock.status,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar empresa:", error);
      // Fallback para mock data
      const empresaIdNum = parseInt(empresaId);
      const empresaMock = mockData.empresas.find((e) => e.id === empresaIdNum);
      if (empresaMock) {
        setEmpresa({
          id: empresaId,
          nome: empresaMock.nome,
          porte: empresaMock.porte,
          site: empresaMock.site,
          marcas: [], // Mock tem string, mas Empresa espera Marca[]
          observacoes: empresaMock.observacoes,
          contatos: empresaMock.contatos,
          status: empresaMock.status,
        });
      }
    }
  };

  const handleContatoClick = (contato: Contato) => {
    // Redirecionar para a página de detalhes do contato
    router.push(`/contatos/${contato.id}`);
  };

  const handleCreateContact = async (novoContato: {
    nome: string;
    empresa: string;
    empresaId?: string; // Adicionado para receber ID da empresa fixa
    cargo?: string;
    email?: string;
    telefone?: string;
    linkedin?: string;
    observacoes?: string;
    status?: string;
    lead?: string;
    diasProximoContato?: number;
  }) => {
    try {
      await apiService.criarContato({
        nome: novoContato.nome,
        cargo: novoContato.cargo,
        observacoes: novoContato.observacoes,
        contatos: {
          telefone: novoContato.telefone || "",
          email: novoContato.email || "",
          linkedin: novoContato.linkedin || "",
        },
        lead:
          novoContato.lead === "quente"
            ? LeadTemperatura.QUENTE
            : novoContato.lead === "frio"
              ? LeadTemperatura.FRIO
              : LeadTemperatura.MORNO,
        empresaId: novoContato.empresaId || empresa?.id.toString(),
      });

      // Recarregar a lista de contatos da empresa
      if (empresa) {
        await loadContatosDoEmpresa();
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar contato:", error);
      // Em caso de erro, adicionar localmente para demonstração
      const novoContatoLocal = {
        id: Date.now().toString(), // Converter para string
        nome: novoContato.nome,
        empresa: empresa?.nome || "",
        cargo: novoContato.cargo || "",
        email: novoContato.email || "",
        telefone: novoContato.telefone || "",
        observacoes: novoContato.observacoes || "",
        status: parseInt(novoContato.status || "0"),
        lead: novoContato.lead || "Morno",
      };

      setContatos((prev) => [...prev, novoContatoLocal]);
      setIsCreateModalOpen(false);
    }
  };

  if (!empresa) {
    return (
      <PageContainer>
        <MainContent>
          <p>Empresa não encontrada</p>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={() => router.push("/empresas")}>← Voltar</BackButton>

      <MainContent>
        {/* Seção da empresa - 1/3 da tela */}
        <EmpresaSection>
          <EmpresaHeader>
            <EmpresaLogo>{empresa.nome.charAt(0).toUpperCase()}</EmpresaLogo>
            <EmpresaInfo>
              <EmpresaNome>{empresa.nome}</EmpresaNome>
              <EmpresaPorte $porte={empresa.porte}>
                {empresa.porte.charAt(0).toUpperCase() + empresa.porte.slice(1)}
              </EmpresaPorte>
            </EmpresaInfo>
          </EmpresaHeader>

          <EmpresaDetails>
            {empresa.site && (
              <DetailRow>
                <DetailLabel>Website</DetailLabel>
                <DetailValue>{empresa.site}</DetailValue>
              </DetailRow>
            )}

            {empresa.marcas && empresa.marcas.length > 0 && (
              <DetailRow>
                <DetailLabel>Marcas</DetailLabel>
                <DetailValue>
                  {empresa.marcas.map((marca) => marca.name).join(", ")}
                </DetailValue>
              </DetailRow>
            )}

            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>
                {empresa.status === 2
                  ? "Ativo"
                  : empresa.status === 1
                    ? "Inativo"
                    : "Prospect"}
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Contatos</DetailLabel>
              <DetailValue>{contatos.length}</DetailValue>
            </DetailRow>

            {empresa.observacoes && (
              <DetailRow>
                <DetailLabel>Observações</DetailLabel>
                <DetailValue>{empresa.observacoes}</DetailValue>
              </DetailRow>
            )}
          </EmpresaDetails>
        </EmpresaSection>

        {/* Seção de Contatos - 2/3 da tela */}
        <ContatosSection>
          <SectionHeader>
            <SectionTitle>Contatos ({contatos.length})</SectionTitle>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(102, 126, 234, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              + Novo Contato
            </button>
          </SectionHeader>

          <ContatosGrid>
            {contatos.map((contato) => (
              <ContatoCard
                key={contato.id}
                onClick={() => handleContatoClick(contato)}
              >
                <ContatoHeader>
                  <div>
                    <ContatoNome>{contato.nome}</ContatoNome>
                    <ContatoCargo>{contato.cargo}</ContatoCargo>
                  </div>
                  <ContatoStatus $status={contato.lead}>
                    {contato.lead}
                  </ContatoStatus>
                </ContatoHeader>
                <ContatoInfo>
                  <div>{contato.email}</div>
                  <div>{contato.telefone}</div>
                </ContatoInfo>
              </ContatoCard>
            ))}
          </ContatosGrid>
        </ContatosSection>
      </MainContent>

      {/* Modal de Criação de Contato */}
      <ContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateContact}
        fixedEmpresaId={empresa?.id}
        fixedEmpresaName={empresa?.nome}
      />
    </PageContainer>
  );
}
