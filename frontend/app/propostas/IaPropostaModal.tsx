"use client";

import { useState, useCallback } from "react";
import { apiService } from "../../src/services/api";
import { useVoiceRecognition } from "../../src/hooks/useVoiceRecognition";
import * as S from "./IaPropostaModal.styles";

export interface IaSugestaoItem {
  itemCatalogoId: string;
  nome: string;
  descricao: string;
  quantidade: number;
  pricingTier: "G" | "M" | "P";
  justificativa: string;
}

export interface IaSugestao {
  titulo: string;
  introducao: string;
  itens: IaSugestaoItem[];
  observacoes: string;
}

interface Props {
  marcaId: number | null;
  onClose: () => void;
  onAplicar: (sugestao: IaSugestao) => void;
}

export default function IaPropostaModal({
  marcaId,
  onClose,
  onAplicar,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sugestao, setSugestao] = useState<IaSugestao | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const onVoiceResult = useCallback((transcript: string) => {
    setDescricao((prev) =>
      prev ? `${prev.trim()} ${transcript}` : transcript,
    );
  }, []);

  const onVoiceError = useCallback((msg: string) => {
    setErro(msg);
  }, []);

  const { isRecording, isSupported, toggleRecording } = useVoiceRecognition({
    onResult: onVoiceResult,
    onError: onVoiceError,
  });

  const handleGerar = async () => {
    if (!descricao.trim()) return;
    setCarregando(true);
    setErro(null);
    setSugestao(null);
    try {
      const resultado = await apiService.sugerirPropostaIA(
        descricao.trim(),
        marcaId,
      );
      setSugestao(resultado);
    } catch (e: unknown) {
      let msg = "Erro ao gerar sugestão. Tente novamente.";
      if (e && typeof e === "object") {
        const err = e as Record<string, unknown>;
        // Detectar timeout do Axios
        if (err.code === "ECONNABORTED" || err.code === "ERR_CANCELED") {
          msg =
            "A IA está demorando mais que o esperado. Tente novamente em alguns segundos.";
        } else if (
          err.response &&
          typeof err.response === "object" &&
          (err.response as Record<string, unknown>).data
        ) {
          const data = (err.response as Record<string, unknown>).data as Record<
            string,
            unknown
          >;
          msg = (data.message as string) || msg;
        } else if (err.message && typeof err.message === "string") {
          msg = err.message;
        }
      }
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && !carregando && descricao.trim()) {
      handleGerar();
    }
  };

  return (
    <S.ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalContent>
        <S.ModalHeader>
          <S.ModalTitle>
            <span>✨</span> HubIA
          </S.ModalTitle>
          <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          {!sugestao && (
            <>
              <S.TextAreaWrapper>
                <S.TextArea
                  placeholder="Descreva o projeto do cliente...&#10;&#10;Ex: O cliente precisa de 3 vídeos institucionais de até 2 minutos, com ator, para campanha interna. Também precisa de 5 vídeo-pílulas de 30s para redes sociais."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={carregando}
                  autoFocus
                />
                {isSupported && !carregando && (
                  <S.VoiceButton
                    type="button"
                    onClick={toggleRecording}
                    $isRecording={isRecording}
                    title={isRecording ? "Parar gravação" : "Ditar com voz"}
                  >
                    {isRecording ? "⏹" : "🎤"}
                  </S.VoiceButton>
                )}
              </S.TextAreaWrapper>
              {isRecording && (
                <S.VoiceHint>🔴 Ouvindo... fale sobre o projeto</S.VoiceHint>
              )}
              {!carregando && (
                <S.GenerateButton
                  onClick={handleGerar}
                  disabled={!descricao.trim() || isRecording}
                >
                  Gerar sugestão
                </S.GenerateButton>
              )}
            </>
          )}

          {carregando && (
            <S.LoadingContainer>
              <S.LoadingDots>⏳</S.LoadingDots>
              <div style={{ color: "var(--color-text-secondary, #9ca3af)" }}>
                Analisando catálogo e gerando proposta...
              </div>
            </S.LoadingContainer>
          )}

          {erro && <S.ErrorText>{erro}</S.ErrorText>}

          {sugestao && (
            <S.ResultSection>
              <div>
                <S.ResultLabel>Título sugerido</S.ResultLabel>
                <S.ResultValue>{sugestao.titulo}</S.ResultValue>
              </div>

              <div>
                <S.ResultLabel>Introdução</S.ResultLabel>
                <S.ResultValue>{sugestao.introducao}</S.ResultValue>
              </div>

              <div>
                <S.ResultLabel>
                  Itens sugeridos ({sugestao.itens.length})
                </S.ResultLabel>
                {sugestao.itens.map((item, i) => (
                  <S.ItemCard key={i}>
                    <S.ItemName>{item.nome}</S.ItemName>
                    <S.ItemMeta>
                      Tier: <strong>{item.pricingTier}</strong> &bull; Qtd:{" "}
                      <strong>{item.quantidade}</strong>
                    </S.ItemMeta>
                    {item.descricao && (
                      <S.ItemMeta>{item.descricao}</S.ItemMeta>
                    )}
                    {item.justificativa && (
                      <S.ItemJustificativa>
                        {item.justificativa}
                      </S.ItemJustificativa>
                    )}
                  </S.ItemCard>
                ))}
              </div>

              {sugestao.observacoes && (
                <S.Observacoes>💡 {sugestao.observacoes}</S.Observacoes>
              )}
            </S.ResultSection>
          )}
        </S.ModalBody>

        {sugestao && (
          <S.ModalFooter>
            <S.CancelButton
              onClick={() => {
                setSugestao(null);
                setErro(null);
              }}
            >
              Refazer
            </S.CancelButton>
            <S.ApplyButton onClick={() => onAplicar(sugestao)}>
              Aplicar na proposta
            </S.ApplyButton>
          </S.ModalFooter>
        )}
      </S.ModalContent>
    </S.ModalOverlay>
  );
}
