import React from "react";
import { FormActions, SaveButton, CancelButton } from "./ContactModal.styles";

interface ContactFormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  isCreating: boolean;
  isCreatingNewCompany?: boolean;
  onCancel: () => void;
}

export const ContactFormActions: React.FC<ContactFormActionsProps> = ({
  isEditMode,
  isLoading,
  isCreating,
  isCreatingNewCompany = false,
  onCancel,
}) => {
  if (!isEditMode) return null;

  // Determinar texto do botão
  let buttonText = "Salvar Alterações";
  if (isLoading) {
    buttonText = "Salvando...";
  } else if (isCreating) {
    buttonText = isCreatingNewCompany ? "Cadastrar Empresa →" : "Criar Contato";
  }

  return (
    <FormActions>
      <CancelButton type="button" onClick={onCancel}>
        Cancelar
      </CancelButton>
      <SaveButton type="submit" disabled={isLoading}>
        {buttonText}
      </SaveButton>
    </FormActions>
  );
};
