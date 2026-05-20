/**
 * EmpresaFormFields - SINGLE SOURCE OF TRUTH para campos de empresa
 *
 * Este componente define TODOS os campos de formulário de empresa.
 * Usado por:
 * - EmpresaModal (cadastro/edição de empresa standalone)
 * - CompanyStepForm (etapa 2 do wizard de contato+empresa)
 *
 * Qualquer mudança aqui reflete automaticamente em ambos os lugares.
 */

import React from "react";
import { MdClose } from "react-icons/md";
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  ErrorMessage,
  StatusBadge,
  MarcasContainer,
  MarcaChip,
  EmptyMarcas,
  MarcasViewContainer,
  MarcaViewChip,
} from "./ClientModal.styles";
import { Marca } from "../../../types";
import { Empresa } from "../../../utils/contatosUtils";

export interface EmpresaFormData {
  nome: string;
  porte: "pequeno" | "medio" | "grande";
  site?: string;
  marcaIds?: number[];
  observacoes?: string;
}

interface EmpresaFormFieldsProps {
  formData: EmpresaFormData;
  errors: { [key: string]: string };
  isEditMode: boolean;
  empresa?: Empresa | null;
  marcasDisponiveis: Marca[];
  loadingMarcas: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onMarcaToggle: (marcaId: number) => void;
  getStatusLabel?: (status: number) => string;
}

export const EmpresaFormFields: React.FC<EmpresaFormFieldsProps> = ({
  formData,
  errors,
  isEditMode,
  empresa,
  marcasDisponiveis,
  loadingMarcas,
  onChange,
  onMarcaToggle,
  getStatusLabel,
}) => {
  return (
    <>
      {/* Nome da Empresa */}
      <FormGroup>
        <FormLabel>
          {empresa ? "Nome da Empresa" : "Nome da Empresa *"}
        </FormLabel>
        <FormInput
          type="text"
          name="nome"
          value={formData.nome}
          onChange={onChange}
          placeholder="Ex: TechCorp, StartupX, InovaCorp"
          disabled={!!empresa && !isEditMode}
        />
        {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
      </FormGroup>

      {/* Porte */}
      <FormGroup>
        <FormLabel>Porte da Empresa</FormLabel>
        <FormSelect
          name="porte"
          value={formData.porte}
          onChange={onChange}
          disabled={!!empresa && !isEditMode}
        >
          <option value="pequeno">Pequeno Porte</option>
          <option value="medio">Médio Porte</option>
          <option value="grande">Grande Porte</option>
        </FormSelect>
      </FormGroup>

      {/* Website */}
      <FormGroup>
        <FormLabel>Website</FormLabel>
        <FormInput
          type="url"
          name="site"
          value={formData.site}
          onChange={onChange}
          placeholder={
            empresa
              ? "https://empresa.com"
              : "www.empresa.com ou https://empresa.com"
          }
          disabled={!!empresa && !isEditMode}
        />
      </FormGroup>

      {/* Marcas */}
      <FormGroup>
        <FormLabel>
          Marcas Associadas {loadingMarcas && "(carregando...)"}
        </FormLabel>
        {(!empresa || isEditMode) && !loadingMarcas && (
          <MarcasContainer>
            {marcasDisponiveis.length === 0 ? (
              <EmptyMarcas>Nenhuma marca cadastrada no sistema</EmptyMarcas>
            ) : (
              marcasDisponiveis.map((marca) => (
                <MarcaChip
                  key={marca.id}
                  type="button"
                  $selected={formData.marcaIds?.includes(marca.id) || false}
                  onClick={() => onMarcaToggle(marca.id)}
                >
                  {marca.name}

                  {formData.marcaIds?.includes(marca.id) && (
                    <MdClose size={16} />
                  )}
                </MarcaChip>
              ))
            )}
          </MarcasContainer>
        )}
        {empresa && !isEditMode && (
          <MarcasViewContainer>
            {empresa.marcas && empresa.marcas.length > 0 ? (
              empresa.marcas.map((marca) => (
                <MarcaViewChip key={marca.id}>{marca.name}</MarcaViewChip>
              ))
            ) : (
              <EmptyMarcas>Nenhuma marca associada</EmptyMarcas>
            )}
          </MarcasViewContainer>
        )}
      </FormGroup>

      {/* Status - só no modo visualização/edição */}
      {empresa && getStatusLabel && (
        <FormGroup>
          <FormLabel>Status</FormLabel>
          <StatusBadge $status={empresa.status || 0}>
            {getStatusLabel(empresa.status || 0)}
          </StatusBadge>
        </FormGroup>
      )}

      {/* Observações */}
      <FormGroup>
        <FormLabel>Observações</FormLabel>
        <FormTextarea
          name="observacoes"
          value={formData.observacoes}
          onChange={onChange}
          placeholder={
            empresa
              ? "Informações adicionais sobre a empresa..."
              : "Informações adicionais sobre a empresa, histórico, necessidades..."
          }
          disabled={!!empresa && !isEditMode}
        />
      </FormGroup>
    </>
  );
};
