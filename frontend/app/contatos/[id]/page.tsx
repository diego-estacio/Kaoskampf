"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ContactAttempts from "../../../src/components/common/ContactAttempts";
import MarcarContatoModal from "../../../src/components/modals/MarcarContatoModal";
import { Contato, carregarContatos } from "../../../src/utils/contatosUtils";
import { apiService } from "../../../src/services/api";
import { useMarcarContato } from "../../../src/hooks/useMarcarContato";
import { usePaginatedObservacoes } from "../../../src/hooks/usePaginatedObservacoes";
import { Pagination } from "../../../src/components/common/Pagination";
import { formatDate, formatRelativeTime } from "../../../src/utils/dateUtils";
import { BadgeDollarSign, PhoneForwarded } from "lucide-react";
import { useAuthStore } from "../../../src/stores/authStore";
import {
  PageContainer,
  BackButton,
  MainContent,
  ContentGrid,
  ContatoSection,
  ObservacoesSection,
  SectionHeader,
  SectionTitle,
  ContatoHeader,
  ContatoInfo,
  ContatoNome,
  ContatoCargo,
  ContatoDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
  StatusDropdown,
  MarcarContatoButton,
  ObservacoesList,
  ObservacaoCard,
  ObservacaoHeader,
  ObservacaoData,
  ObservacaoTexto,
  NovaObservacaoForm,
  ObservacaoInput,
  AddObservacaoButton,
} from "./ContatoPage.styles";

const statusOptions = [
  { value: "0", label: "Cadastrado" },
  { value: "2", label: "Reunião" },
  { value: "3", label: "Proposta" },
  { value: "4", label: "Atendimento" },
];

export default function ContatoPage() {
  const router = useRouter();
  const params = useParams();
  const [contato, setContato] = useState<Contato | null>(null);
  const [novaObservacao, setNovaObservacao] = useState("");

  // Hook de paginação para observações
  const {
    items: observacoes,
    currentPage,
    totalPages,
    loading: loadingObservacoes,
    goToPage,
    addObservacao,
  } = usePaginatedObservacoes({
    contatoId: params.id as string,
    itemsPerPage: 5,
  });

  const currentUser = useAuthStore((state) => state.usuario);

  const checkPermission = () => {
    if (!contato || !currentUser) return true;

    // Se for admin ou master, não precisa do aviso
    if (currentUser.role === "ADMIN" || currentUser.role === "MASTER") {
      return true;
    }

    // Se for o criador, também não precisa
    const myId = currentUser.id || (currentUser as any).uuid || (currentUser as any).sub || "";
    const creatorId = contato.usuarioCriadorId;

    if (myId && creatorId && myId.toString() === creatorId.toString()) {
      return true;
    }

    // Caso contrário, mostra o confirm
    const nomeCriador = contato.usuarioCriador?.nome || "outro usuário";
    return window.confirm(
      `Este contato foi criado por ${nomeCriador}. Tem certeza que deseja prosseguir?`
    );
  };

  const {
    isModalOpen: isMarcarContatoModalOpen,
    numeroTentativa,
    handleOpenModal: handleOpenMarcarContato,
    handleCloseModal: handleCloseMarcarContato,
    handleConfirmarMarcacao,
  } = useMarcarContato();

  useEffect(() => {
    loadContato();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadContato = async () => {
    try {
      const contatos = await carregarContatos();
      const contatoId = params.id as string;
      const contatoEncontrado = contatos.find((c) => c.id === contatoId);

      if (contatoEncontrado) {
        setContato(contatoEncontrado);
        // Não precisa mais carregar observações - hook faz isso
      }
    } catch (error) {
      console.error("Erro ao carregar contato:", error);
    }
  };

  const handleStatusChange = async (novoStatus: string) => {
    if (!contato) return;

    if (!checkPermission()) return;

    try {
      await apiService.atualizarStatusContato(contato.id, novoStatus);
      setContato((prev) => (prev ? { ...prev, status: novoStatus } : null));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleAddObservacao = async () => {
    if (!novaObservacao.trim()) return;

    if (!checkPermission()) return;

    await addObservacao(novaObservacao);
    setNovaObservacao("");
  };

  // Wrapper para abrir modal com contato atual
  const handleOpenMarcarContatoClick = () => {
    if (!contato) return;

    if (!checkPermission()) return;

    handleOpenMarcarContato(contato);
  };

  // Handler com optimistic update
  const handleConfirmarMarcacaoComReload = async (
    observacao: string,
    via: string,
  ) => {
    if (!contato) return;

    const numeroContatosAnterior = contato.numeroContatos || 0;

    // 1. OPTIMISTIC UPDATE: Incrementa numeroContatos IMEDIATAMENTE
    const optimisticUpdate = () => {
      setContato((prev) =>
        prev
          ? { ...prev, numeroContatos: (prev.numeroContatos || 0) + 1 }
          : null,
      );
    };

    // 2. SUCESSO: Recarrega dados sincronizados do backend
    const onSuccess = async () => {
      await loadContato();
    };

    // 3. ERRO: Reverte para valor anterior
    const onError = () => {
      setContato((prev) =>
        prev ? { ...prev, numeroContatos: numeroContatosAnterior } : null,
      );
    };

    await handleConfirmarMarcacao(
      observacao,
      via,
      optimisticUpdate,
      onSuccess,
      onError,
    );
  };

  const handleCriarProposta = () => {
    if (!contato) return;

    if (!checkPermission()) return;

    router.push(
      `/propostas?contatoId=${encodeURIComponent(contato.id)}&nova=1`,
    );
  };

  if (!contato) {
    return (
      <PageContainer>
        <MainContent>
          <p>Contato não encontrado</p>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContent>
        <BackButton onClick={() => router.push("/contatos")}>
          ← Voltar
        </BackButton>

        <ContentGrid>
          <ObservacoesSection>
            <SectionHeader>
              <SectionTitle>Observações</SectionTitle>
            </SectionHeader>

            <NovaObservacaoForm>
              <ObservacaoInput
                value={novaObservacao}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNovaObservacao(e.target.value)
                }
                placeholder="Adicionar nova observação..."
                rows={3}
              />
              <AddObservacaoButton onClick={handleAddObservacao}>
                Adicionar Observação
              </AddObservacaoButton>
            </NovaObservacaoForm>

            <ObservacoesList>
              {loadingObservacoes ? (
                <p>Carregando observações...</p>
              ) : observacoes.length === 0 ? (
                <p>Nenhuma observação ainda.</p>
              ) : (
                observacoes.map((obs) => (
                  <ObservacaoCard key={obs.id}>
                    <ObservacaoHeader>
                      <span>{obs.autor?.nome}</span>
                      <ObservacaoData>
                        {formatRelativeTime(obs.criadaEm)}
                      </ObservacaoData>
                    </ObservacaoHeader>
                    <ObservacaoTexto>{obs.texto}</ObservacaoTexto>
                  </ObservacaoCard>
                ))
              )}
            </ObservacoesList>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </ObservacoesSection>
          <ContatoSection>
            <ContatoHeader>
              <ContatoInfo>
                <ContatoNome>{contato.nome}</ContatoNome>
                <ContatoCargo>{contato.cargo}</ContatoCargo>
              </ContatoInfo>
            </ContatoHeader>

            <ContatoDetails>
              <DetailRow>
                <DetailLabel>Empresa:</DetailLabel>
                <DetailValue>{contato.empresa?.nome || "Não informada"}</DetailValue>
              </DetailRow>
              {contato.email && (
                <DetailRow>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>{contato.email}</DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Telefone:</DetailLabel>
                <DetailValue>{contato.telefone}</DetailValue>
              </DetailRow>
              {contato.contatos?.linkedin && (
                <DetailRow>
                  <DetailLabel>LinkedIn:</DetailLabel>
                  <DetailValue>
                    <a
                      href={contato.contatos.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0077b5", textDecoration: "none" }}
                    >
                      {contato.contatos.linkedin}
                    </a>
                  </DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Cadastrado em:</DetailLabel>
                <DetailValue>
                  {contato.criadoEm ? (
                    <>
                      {formatDate(contato.criadoEm)}
                      {contato.usuarioCriador?.nome && (
                        <> por <strong>{contato.usuarioCriador.nome}</strong></>
                      )}
                    </>
                  ) : (
                    "Data não disponível"
                  )}
                </DetailValue>
              </DetailRow>

              {contato.ultimoContatoRealizado && (
                <DetailRow>
                  <DetailLabel>Última Tentativa:</DetailLabel>
                  <DetailValue>
                    {formatDate(contato.ultimoContatoRealizado)}
                  </DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <StatusDropdown
                  value={contato.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleStatusChange(e.target.value)
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </StatusDropdown>
              </DetailRow>
              {contato.observacoes && (
                <DetailRow>
                  <DetailLabel>Observações Iniciais:</DetailLabel>
                  <DetailValue>{contato.observacoes}</DetailValue>
                </DetailRow>
              )}
            </ContatoDetails>

            <MarcarContatoButton onClick={handleCriarProposta}>
              <BadgeDollarSign size={24} style={{ marginRight: "8px" }} />
              Criar proposta
            </MarcarContatoButton>
            <MarcarContatoButton onClick={handleOpenMarcarContatoClick}>
              <PhoneForwarded size={20} style={{ marginRight: "8px" }} /> Marcar
              Contato Realizado
            </MarcarContatoButton>
            <ContactAttempts
              contatoId={contato.id}
              maxAttempts={5}
              size="medium"
              numeroContatos={contato.numeroContatos || 0}
            />
          </ContatoSection>
        </ContentGrid>
      </MainContent>

      {/* Modal de Marcar Contato */}
      <MarcarContatoModal
        isOpen={isMarcarContatoModalOpen}
        onClose={handleCloseMarcarContato}
        onConfirm={handleConfirmarMarcacaoComReload}
        numeroTentativa={numeroTentativa}
      />
    </PageContainer>
  );
}
