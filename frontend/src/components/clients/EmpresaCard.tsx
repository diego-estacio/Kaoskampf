import React from "react";
import { Empresa } from "../../utils/contatosUtils";
import {
  obterLabelStatus,
  obterCorStatus,
} from "../../utils/empresaStatusUtils";
import * as S from "../../../app/empresas/styles";

interface EmpresaCardProps {
  empresa: Empresa;
  numeroClientes: number;
  numeroLeads: number;
  statusEmpresa: number;
  onEdit: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export const EmpresaCard: React.FC<EmpresaCardProps> = ({
  empresa,
  numeroClientes,
  numeroLeads,
  statusEmpresa,
  onEdit,
  onClick,
}) => {
  const corStatus = obterCorStatus(statusEmpresa);

  return (
    <S.EmpresaCard $status={statusEmpresa} onClick={onClick}>
      <S.EmpresaHeader>
        <S.EmpresaName>{empresa.nome}</S.EmpresaName>
      </S.EmpresaHeader>

      <S.EmpresaInfo>
        {empresa.site && <S.EmpresaSite>{empresa.site}</S.EmpresaSite>}
      </S.EmpresaInfo>

      <S.EmpresaStats>
        <S.StatItem>
          <S.StatNumber>{numeroClientes}</S.StatNumber>
          <S.StatLabel>Clientes</S.StatLabel>
        </S.StatItem>
        <S.StatItem>
          <S.StatNumber>{numeroLeads}</S.StatNumber>
          <S.StatLabel>Leads</S.StatLabel>
        </S.StatItem>
        <S.EmpresaPorte
          $porte={obterLabelStatus(statusEmpresa)}
          style={{
            backgroundColor: corStatus.bg,
            color: corStatus.text,
          }}
        >
          {obterLabelStatus(statusEmpresa)}
        </S.EmpresaPorte>
      </S.EmpresaStats>

      <S.EmpresaActions>
        <S.ActionButton className="secondary" onClick={onEdit}>
          Editar
        </S.ActionButton>
        <S.ActionButton className="primary" onClick={onClick}>
          Ver Detalhes
        </S.ActionButton>
      </S.EmpresaActions>
    </S.EmpresaCard>
  );
};
