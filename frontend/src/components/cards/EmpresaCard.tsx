import { formatUtils, statusUtils } from "../../utils";

import * as S from "./styles";

interface EmpresaCardProps {
  empresa: {
    id: number;
    nome: string;
    porte: string;
    site: string;
    marcas: string;
    observacoes: string;
    contatos: number;
    status: number;
  };
  onClick: (id: number) => void;
}

export function EmpresaCard({ empresa, onClick }: EmpresaCardProps) {
  return (
    <S.CardContainer onClick={() => onClick(empresa.id)}>
      <S.CardHeader>
        <S.EmpresaLogo>{formatUtils.getInitials(empresa.nome)}</S.EmpresaLogo>
        <S.CardInfo>
          <S.CardTitle>{empresa.nome}</S.CardTitle>
          <S.CardSubtitle>
            <a
              href={`https://${empresa.site}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: "#8b5cf6", textDecoration: "none" }}
            >
              {empresa.site}
            </a>
          </S.CardSubtitle>
          <S.StatusBadge $porte={empresa.porte}>
            {empresa.porte.charAt(0).toUpperCase() + empresa.porte.slice(1)}{" "}
            Porte
          </S.StatusBadge>
        </S.CardInfo>
      </S.CardHeader>

      <S.CardDetails>
        <S.CardDetail>
          <S.DetailLabel>Marcas:</S.DetailLabel>
          <S.DetailValue>
            {formatUtils.truncateText(empresa.marcas, 20)}
          </S.DetailValue>
        </S.CardDetail>
        <S.CardDetail>
          <S.DetailLabel>Status:</S.DetailLabel>
          <S.DetailValue>
            {statusUtils.getStatusLabel(empresa.status)}
          </S.DetailValue>
        </S.CardDetail>
        <S.CardDetail>
          <S.DetailLabel>Contatos:</S.DetailLabel>
          <S.DetailValue>{empresa.contatos}</S.DetailValue>
        </S.CardDetail>
        <S.CardDetail>
          <S.DetailLabel>Observações:</S.DetailLabel>
          <S.DetailValue>
            {formatUtils.truncateText(empresa.observacoes, 30)}
          </S.DetailValue>
        </S.CardDetail>
      </S.CardDetails>
    </S.CardContainer>
  );
}
