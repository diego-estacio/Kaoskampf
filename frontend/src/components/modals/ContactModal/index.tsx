import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormTextarea,
} from "./ContactModal.styles";
import { useContactForm, ContactFormData } from "../../../hooks/useContactForm";
import { ContactFormFields } from "./ContactFormFields";
import { ContactFormActions } from "./ContactFormActions";
import { Contato } from "../../../utils/contatosUtils";
import CompanyStepForm from "../CompanyStepForm";
import { EmpresaFormData } from "../ClientModal/ClientFormFields";
import { apiService } from "../../../services/api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contato: ContactFormData) => Promise<void>;
  contact?: Contato | null;
  empresas?: { id: string; nome: string }[];
  fixedEmpresaId?: string; // ID da empresa fixa (oculta dropdown)
  fixedEmpresaName?: string; // Nome da empresa (para exibição)
}

export default function ContactModal({
  isOpen,
  onClose,
  onSave,
  contact = null,
  empresas = [],
  fixedEmpresaId,
  fixedEmpresaName,
}: ContactModalProps) {
  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [companyData, setCompanyData] = useState<EmpresaFormData>({
    nome: "",
    porte: "medio",
    site: "",
    marcaIds: [],
    observacoes: "",
  });

  // Usar custom hook para gerenciar formulário
  const {
    formData,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    validateForm,
  } = useContactForm({ contact, isOpen });

  // Resetar wizard quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setWizardStep(1);
      setCompanyData({
        nome: "",
        porte: "medio",
        site: "",
        marcaIds: [],
        observacoes: "",
      });
    }
  }, [isOpen]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se está criando nova empresa, vai para step 2 do wizard
    if (formData.isNovaEmpresa && wizardStep === 1) {
      if (!validateForm()) {
        return;
      }
      setWizardStep(2);
      return;
    }

    // Submit normal (sem wizard)
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        empresaId: fixedEmpresaId || formData.empresaId || formData.empresa,
        fixedEmpresaId: fixedEmpresaId,
      };

      await onSave(dataToSave);
      onClose(); // Fecha modal após salvar
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Se está no step 2, volta para step 1
    if (wizardStep === 2) {
      setWizardStep(1);
      return;
    }
    onClose(); // Fecha modal
  };

  const handleCompanySubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Criar empresa
      console.log("📝 Criando empresa:", companyData);
      const novaEmpresa = await apiService.criarEmpresa(companyData);
      console.log("✅ Empresa criada:", novaEmpresa);
      const newempresaId = novaEmpresa.id;

      // 2. Criar contato com ID da nova empresa
      const dataToSave = {
        ...formData,
        empresaId: String(newempresaId), // Campo que criarContatoAPI espera
        fixedEmpresaId: undefined, // Não há fixed quando criando nova empresa
        // NÃO enviar 'empresa' (nome) para evitar criar empresa duplicada
      };

      // Remover campo 'empresa' se existir
      delete (dataToSave as any).empresa;

      console.log("📝 Criando contato:", dataToSave);
      await onSave(dataToSave);
      console.log("✅ Contato criado com sucesso");
      onClose(); // Fecha modal após salvar
    } catch (error) {
      console.error("❌ Erro ao salvar contato com nova empresa:", error);
      alert(
        "Erro ao cadastrar empresa ou contato. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização
  if (!isOpen) return null;

  const modalTitle = contact ? "Editar Contato" : "Novo Contato";
  const isCreating = !contact;
  const isCreatingNewCompany = formData.isNovaEmpresa && wizardStep === 1;

  // Step 2: Wizard - Cadastro de empresa
  if (wizardStep === 2) {
    return (
      <CompanyStepForm
        companyData={companyData}
        onCompanyDataChange={setCompanyData}
        onBack={() => setWizardStep(1)}
        onSubmit={handleCompanySubmit}
        isLoading={isLoading}
      />
    );
  }

  // Step 1: Formulário de contato
  return (
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ContactFormFields
            formData={formData}
            errors={errors}
            isEditMode={true}
            isCreating={isCreating}
            contact={contact}
            empresas={empresas}
            fixedEmpresaId={fixedEmpresaId}
            fixedEmpresaName={fixedEmpresaName}
            onChange={handleChange}
            getStatusLabel={() => ""}
            formatarData={() => ""}
          />

          {/* Campo de observações - SÓ aparece na CRIAÇÃO */}
          {isCreating && (
            <FormTextarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações iniciais sobre este contato (opcional)..."
              style={{ marginTop: "1rem" }}
            />
          )}

          <ContactFormActions
            isEditMode={true}
            isLoading={isLoading}
            isCreating={isCreating}
            isCreatingNewCompany={isCreatingNewCompany}
            onCancel={handleCancel}
          />
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
