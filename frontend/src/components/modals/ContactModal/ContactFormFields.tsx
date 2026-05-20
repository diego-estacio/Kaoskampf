import React from "react";
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  ErrorMessage,
  StatusBadge,
} from "./ContactModal.styles";
import { ContactFormData } from "../../../hooks/useContactForm";
import { Contato } from "../../../utils/contatosUtils";

interface ContactFormFieldsProps {
  formData: ContactFormData;
  errors: { [key: string]: string };
  isEditMode: boolean;
  isCreating: boolean;
  contact: Contato | null;
  empresas: { id: string; nome: string }[];
  fixedEmpresaId?: string; // ID da empresa fixa
  fixedEmpresaName?: string; // Nome da empresa fixa
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  getStatusLabel: (status: string) => string;
  formatarData: (dataString: string) => string;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  errors,
  isEditMode,
  isCreating,
  contact,
  empresas,
  fixedEmpresaId,
  fixedEmpresaName,
  onChange,
  getStatusLabel,
  formatarData,
}) => {
  return (
    <>
      <FormGroup>
        <FormLabel>{isCreating ? "Nome *" : "Nome"}</FormLabel>
        <FormInput
          type="text"
          name="nome"
          value={formData.nome}
          onChange={onChange}
          placeholder={isCreating ? "Nome completo do contato" : undefined}
          disabled={!isEditMode}
        />
        {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <FormLabel>{isCreating ? "Empresa *" : "Empresa"}</FormLabel>

        {isCreating && !fixedEmpresaId && (
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.25rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isNovaEmpresa"
                checked={formData.isNovaEmpresa}
                onChange={onChange}
              />
              Nova empresa?
            </label>
          </div>
        )}

        {fixedEmpresaId ? (
          // Modo fixo - campo readonly quando vem de /empresas/[id]
          <FormInput
            type="text"
            name="empresa"
            value={fixedEmpresaName || ""}
            disabled
            style={{ background: "#12121f", color: "#a0aec0" }}
          />
        ) : formData.isNovaEmpresa ? (
          // Modo criação de NOVA empresa (texto livre)
          <FormInput
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={onChange}
            placeholder="Nome da nova empresa"
            autoFocus
          />
        ) : empresas.length > 0 && isCreating ? (
          // Modo dropdown - selecionar empresa existente
          <FormSelect
            name="empresa"
            value={formData.empresa}
            onChange={onChange}
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </FormSelect>
        ) : (
          // Modo edição ou sem empresas
          <FormInput
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={onChange}
            placeholder={isCreating ? "Nome da empresa" : undefined}
            disabled={!isCreating}
            style={
              !isCreating
                ? { background: "#12121f", color: "#a0aec0" }
                : undefined
            }
          />
        )}
        {errors.empresa && <ErrorMessage>{errors.empresa}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <FormLabel>Cargo</FormLabel>
        <FormInput
          type="text"
          name="cargo"
          value={formData.cargo}
          onChange={onChange}
          placeholder={
            isCreating
              ? "Ex: CEO, Diretor de TI, Gerente de Marketing"
              : undefined
          }
          disabled={!isEditMode}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder={isCreating ? "email@empresa.com" : undefined}
          disabled={!isEditMode}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <FormLabel>Telefone</FormLabel>
        <FormInput
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={onChange}
          placeholder={isCreating ? "(11) 99999-9999" : undefined}
          disabled={!isEditMode}
        />
      </FormGroup>

      {isCreating && (
        <FormGroup>
          <FormLabel>LinkedIn</FormLabel>
          <FormInput
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={onChange}
            placeholder="https://linkedin.com/in/usuario"
          />
        </FormGroup>
      )}

      <FormGroup>
        <FormLabel>Status</FormLabel>
        {isEditMode ? (
          <FormSelect name="status" value={formData.status} onChange={onChange}>
            <option value="0">Cadastrado</option>
            <option value="2">Reunião</option>
            <option value="3">Proposta</option>
            <option value="4">Atendimento</option>
          </FormSelect>
        ) : (
          <StatusBadge $status={formData.status}>
            {getStatusLabel(formData.status)}
          </StatusBadge>
        )}
      </FormGroup>

      {isCreating && (
        <FormGroup>
          <FormLabel>Dias para próximo contato</FormLabel>
          <FormInput
            type="number"
            name="diasProximoContato"
            value={formData.diasProximoContato}
            onChange={onChange}
            min="1"
            max="30"
          />
          {errors.diasProximoContato && (
            <ErrorMessage>{errors.diasProximoContato}</ErrorMessage>
          )}
        </FormGroup>
      )}
    </>
  );
};
