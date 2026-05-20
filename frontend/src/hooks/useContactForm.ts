import { useState, useEffect } from "react";
import { Contato } from "../utils/contatosUtils";
import { formatPhoneBr } from "../utils/phoneUtils";

export interface ContactFormData {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  linkedin?: string;
  observacoes: string;
  status: string;
  lead: string;
  empresaId?: string; // ID da empresa selecionada (usado pela API)
  fixedEmpresaId?: string; // ID da empresa fixa (quando vem de /empresas/[id])
  isNovaEmpresa: boolean;
}

interface UseContactFormProps {
  contact?: Contato | null;
  isOpen: boolean;
}

export const useContactForm = ({ contact, isOpen }: UseContactFormProps) => {
  const isEditing = !!contact;
  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [formData, setFormData] = useState<ContactFormData>({
    nome: "",
    empresa: "",
    cargo: "",
    email: "",
    telefone: "",
    linkedin: "",
    observacoes: "",
    status: "0", // 0 = CADASTRO no enum StatusContato
    lead: "morno",
    diasProximoContato: 3,
    isNovaEmpresa: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar form quando modal abre
  useEffect(() => {
    if (isOpen) {
      if (contact) {
        // Modo edição - preencher com dados do contato
        setFormData({
          nome: contact.nome,
          empresa: contact.empresa.nome,
          cargo: contact.cargo,
          email: contact.email,
          telefone: contact.telefone,
          linkedin: contact.contatos?.linkedin || "",
          observacoes: contact.observacoes,
          status: contact.status, // já vem como "0", "2", "3" ou "4"
          lead: contact.leadTemperatura || "morno",
          diasProximoContato: 3,
          isNovaEmpresa: false,
        });
        setIsEditMode(true); // Começar em modo edição
      } else {
        // Modo criação - resetar form
        resetForm();
        setIsEditMode(true); // Começar em modo edição
      }
      setErrors({});
    }
  }, [isOpen, contact]);

  const resetForm = () => {
    setFormData({
      nome: "",
      empresa: "",
      cargo: "",
      email: "",
      telefone: "",
      linkedin: "",
      observacoes: "",
      status: "0",
      lead: "morno",
      diasProximoContato: 3,
      isNovaEmpresa: false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        empresa: "",
        empresaId: "",
      }));
    } else if (name === "diasProximoContato") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else if (name === "telefone") {
      const masked = formatPhoneBr(value);
      setFormData((prev) => ({ ...prev, [name]: masked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpar erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditToggle = () => {
    if (isEditMode && contact) {
      // Cancelar edição - restaurar dados originais
      setFormData({
        nome: contact.nome,
        empresa: contact.empresa.nome,
        cargo: contact.cargo,
        email: contact.email,
        telefone: contact.telefone,
        linkedin: contact.contatos?.linkedin || "",
        observacoes: contact.observacoes,
        status: contact.status,
        lead: contact.leadTemperatura || "morno",
        diasProximoContato: 3,
        isNovaEmpresa: false,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = "Empresa é obrigatória";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.diasProximoContato < 1) {
      newErrors.diasProximoContato = "Deve ser pelo menos 1 dia";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    isLoading,
    setIsLoading,
    isEditMode,
    isEditing,
    handleChange,
    handleEditToggle,
    validateForm,
    resetForm,
  };
};
