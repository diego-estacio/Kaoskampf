/**
 * CompanyStepForm - Etapa 2 do Wizard (Cadastro de Contato + Empresa)
 *
 * Este componente é exibido quando o usuário seleciona "+Nova Empresa"
 * no formulário de contato. Reutiliza EmpresaFormFields (SSOT).
 *
 * Fluxo:
 * 1. Usuário preenche dados do contato (etapa 1)
 * 2. Seleciona "+Nova Empresa"
 * 3. Este formulário aparece (etapa 2)
 * 4. Ao submeter: cadastra empresa → cadastra contato vinculado
 */

import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Marca } from "../../../types";
import {
  EmpresaFormFields,
  EmpresaFormData,
} from "../ClientModal/ClientFormFields";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Form,
  FormActions,
  SaveButton,
  CancelButton,
} from "../ClientModal/ClientModal.styles";
import styled from "styled-components";

const WizardSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) =>
    props.$active ? "#8b5cf6" : props.$completed ? "#10b981" : "#718096"};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
`;

const StepNumber = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.$active ? "#8b5cf6" : props.$completed ? "#10b981" : "#e2e8f0"};
  color: ${(props) =>
    props.$active || props.$completed ? "white" : "#a0aec0"};
`;

const StepSeparator = styled.div`
  width: 40px;
  height: 2px;
  background: #1e1e3a;
`;

const BackButton = styled(CancelButton)`
  background: #1a1a2e;
  color: #a0aec0;

  &:hover {
    background: #1e1e3a;
  }
`;

interface CompanyStepFormProps {
  companyData: EmpresaFormData;
  onCompanyDataChange: (data: EmpresaFormData) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export default function CompanyStepForm({
  companyData,
  onCompanyDataChange,
  onBack,
  onSubmit,
  isLoading,
}: CompanyStepFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [marcasDisponiveis, setMarcasDisponiveis] = useState<Marca[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  useEffect(() => {
    loadMarcas();
  }, []);

  const loadMarcas = async () => {
    try {
      setLoadingMarcas(true);
      const marcas = await apiService.buscarMarcas();
      setMarcasDisponiveis(marcas);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    } finally {
      setLoadingMarcas(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    onCompanyDataChange({ ...companyData, [name]: value });

    // Limpar erro quando usuário digita
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMarcaToggle = (marcaId: number) => {
    const marcaIds = companyData.marcaIds || [];
    const isSelected = marcaIds.includes(marcaId);
    onCompanyDataChange({
      ...companyData,
      marcaIds: isSelected
        ? marcaIds.filter((id) => id !== marcaId)
        : [...marcaIds, marcaId],
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!companyData.nome.trim()) {
      newErrors.nome = "Nome da empresa é obrigatório";
    }

    // Auto-correct website URL
    if (companyData.site && !companyData.site.startsWith("http")) {
      const correctedSite = companyData.site.startsWith("www.")
        ? `https://${companyData.site}`
        : `https://www.${companyData.site}`;

      onCompanyDataChange({
        ...companyData,
        site: correctedSite,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit();
  };

  return (
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Nova Empresa</ModalTitle>
        </ModalHeader>

        {/* Indicador de Progresso */}
        <WizardSteps>
          <Step $active={false} $completed={true}>
            <StepNumber $active={false} $completed={true}>
              ✓
            </StepNumber>
            Contato
          </Step>
          <StepSeparator />
          <Step $active={true} $completed={false}>
            <StepNumber $active={true} $completed={false}>
              2
            </StepNumber>
            Empresa
          </Step>
        </WizardSteps>

        <Form onSubmit={handleSubmitForm}>
          {/* SSOT: Usando os mesmos campos do EmpresaModal */}
          <EmpresaFormFields
            formData={companyData}
            errors={errors}
            isEditMode={true}
            empresa={null}
            marcasDisponiveis={marcasDisponiveis}
            loadingMarcas={loadingMarcas}
            onChange={handleChange}
            onMarcaToggle={handleMarcaToggle}
          />

          <FormActions>
            <BackButton type="button" onClick={onBack}>
              ← Voltar
            </BackButton>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Empresa e Contato"}
            </SaveButton>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
