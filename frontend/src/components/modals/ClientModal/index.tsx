import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Marca } from "../../../types";
import { obterLabelStatus as obterLabelStatusEmpresa } from "../../../utils/empresaStatusUtils";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  HeaderActions,
  EditButton,
  CloseButton,
  Form,
  FormActions,
  SaveButton,
  CancelButton,
} from "./ClientModal.styles";
import { Empresa } from "../../../utils/contatosUtils";
import { EmpresaFormFields, EmpresaFormData } from "./ClientFormFields";

interface EmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empresa: EmpresaFormData) => Promise<void>;
  empresa?: Empresa | null; // Se fornecido, é modo edição
}

export default function EmpresaModal({
  isOpen,
  onClose,
  onSave,
  empresa = null,
}: EmpresaModalProps) {
  const [isEditMode] = useState(true); // Modal sempre em modo edição
  const [formData, setFormData] = useState<EmpresaFormData>({
    nome: "",
    porte: "pequeno",
    site: "",
    marcaIds: [],
    observacoes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [marcasDisponiveis, setMarcasDisponiveis] = useState<Marca[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMarcas();
      if (empresa) {
        // Modo edição - preencher com dados da empresa
        setFormData({
          nome: empresa.nome,
          porte: empresa.porte,
          site: empresa.site || "",
          marcaIds: empresa.marcas?.map((m) => m.id) || [],
          observacoes: empresa.observacoes || "",
        });
      } else {
        // Modo criação - resetar form
        setFormData({
          nome: "",
          porte: "pequeno",
          site: "",
          marcaIds: [],
          observacoes: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, empresa]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMarcaToggle = (marcaId: number) => {
    setFormData((prev) => {
      const marcaIds = prev.marcaIds || [];
      const isSelected = marcaIds.includes(marcaId);
      return {
        ...prev,
        marcaIds: isSelected
          ? marcaIds.filter((id) => id !== marcaId)
          : [...marcaIds, marcaId],
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da empresa é obrigatório";
    }

    // Auto-correct website URL
    if (formData.site && !formData.site.startsWith("http")) {
      const correctedSite = formData.site.startsWith("www.")
        ? `https://${formData.site}`
        : `https://www.${formData.site}`;

      setFormData((prev) => ({
        ...prev,
        site: correctedSite,
      }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      // Após salvar, apenas mantém a modal aberta para o usuário decidir fechar
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: number) => {
    return obterLabelStatusEmpresa(status);
  };

  if (!isOpen) return null;

  const modalTitle = empresa ? formData.nome : "Nova Empresa";

  return (
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
          <HeaderActions>
            <CloseButton onClick={onClose}>×</CloseButton>
          </HeaderActions>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <EmpresaFormFields
            formData={formData}
            errors={errors}
            isEditMode={isEditMode}
            empresa={empresa}
            marcasDisponiveis={marcasDisponiveis}
            loadingMarcas={loadingMarcas}
            onChange={handleChange}
            onMarcaToggle={handleMarcaToggle}
            getStatusLabel={getStatusLabel}
          />

          <FormActions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : empresa
                  ? "Salvar Alterações"
                  : "Criar Empresa"}
            </SaveButton>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
