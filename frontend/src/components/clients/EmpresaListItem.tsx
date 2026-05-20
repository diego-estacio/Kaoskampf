import React from "react";
import { Empresa } from "../../utils/contatosUtils";
import {
  obterLabelStatus,
  obterCorStatus,
} from "../../utils/empresaStatusUtils";
import * as S from "../../../app/empresas/styles";

interface EmpresaListItemProps {
  empresa: Empresa;
  numeroClientes: number;
  numeroLeads: number;
  statusEmpresa: number;
  onEdit: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export const EmpresaListItem: React.FC<EmpresaListItemProps> = ({
  empresa,
  numeroClientes,
  numeroLeads,
  statusEmpresa,
  onEdit,
  onClick,
}) => {
  const corStatus = obterCorStatus(statusEmpresa);

  return (
    <S.EmpresaListItem $status={statusEmpresa} onClick={onClick}>
      <S.ListItemContent>
        <S.ListItemMain>
          <S.ListItemName>{empresa.nome}</S.ListItemName>
          {empresa.site && <S.ListItemSite>{empresa.site}</S.ListItemSite>}
        </S.ListItemMain>
        <S.ListItemDetail>
          <S.ListItemLabel>Clientes:</S.ListItemLabel>
          <S.ListItemValue>{numeroClientes}</S.ListItemValue>
        </S.ListItemDetail>
        <S.ListItemDetail>
          <S.ListItemLabel>Leads:</S.ListItemLabel>
          <S.ListItemValue>{numeroLeads}</S.ListItemValue>
        </S.ListItemDetail>
        <S.ListItemDetail>
          <S.ListItemLabel>Porte:</S.ListItemLabel>
          <S.ListItemValue>
            {empresa.porte.charAt(0).toUpperCase() + empresa.porte.slice(1)}
          </S.ListItemValue>
        </S.ListItemDetail>
        <S.ListItemStatusBadge
          style={{
            backgroundColor: corStatus.bg,
            color: corStatus.text,
          }}
        >
          {obterLabelStatus(statusEmpresa)}
        </S.ListItemStatusBadge>
        <S.ListItemActions>
          <S.ActionButton className="small secondary" onClick={onEdit}>
            Editar
          </S.ActionButton>
          <S.ActionButton className="small primary" onClick={onClick}>
            Ver Detalhes
          </S.ActionButton>
        </S.ListItemActions>
      </S.ListItemContent>
    </S.EmpresaListItem>
  );
};
