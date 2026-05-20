// Utilitários para autenticação
export const authUtils = {
  getUser: () => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("kaoskampf_user");
    return userData ? JSON.parse(userData) : null;
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("kaoskampf_token");
  },

  setAuth: (token: string, user: object) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("kaoskampf_token", token);
    localStorage.setItem("kaoskampf_user", JSON.stringify(user));

    // Salvar no cookie para o middleware
    const authData = { token, user };
    document.cookie = `kaoskampf-auth=${JSON.stringify(
      authData,
    )}; path=/; max-age=${60 * 60 * 24 * 7}`;
  },

  clearAuth: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("kaoskampf_token");
    localStorage.removeItem("kaoskampf_user");
    // Limpar também as chaves antigas para compatibilidade
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie =
      "kaoskampf-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },

  updateUser: (userData: object) => {
    if (typeof window === "undefined") return;

    const currentAuth = localStorage.getItem("kaoskampf_token");
    if (currentAuth) {
      localStorage.setItem("kaoskampf_user", JSON.stringify(userData));

      // Atualizar cookie também
      const authData = { token: currentAuth, user: userData };
      document.cookie = `kaoskampf-auth=${JSON.stringify(
        authData,
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  },
};

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

// Configurar Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

// Função helper para obter timezone do usuário
const getUserTimezone = (): string => {
  try {
    return dayjs.tz.guess() || "America/Sao_Paulo";
  } catch {
    return "America/Sao_Paulo";
  }
};

// Utilitários para formatação
export const formatUtils = {
  formatDate: (date: Date | string) => {
    if (!date) return "Data não disponível";
    try {
      const userTz = getUserTimezone();
      return dayjs(date).tz(userTz).format("DD/MM/YYYY");
    } catch {
      return "Data inválida";
    }
  },

  formatDateTime: (date: Date | string) => {
    if (!date) return "Data não disponível";
    try {
      const userTz = getUserTimezone();
      return dayjs(date).tz(userTz).format("DD/MM/YYYY HH:mm");
    } catch {
      return "Data inválida";
    }
  },

  formatPhone: (phone: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, "");

    // Aplica a máscara (11) 99999-9999
    if (numbers.length === 11) {
      return `(${numbers.substr(0, 2)}) ${numbers.substr(
        2,
        5,
      )}-${numbers.substr(7, 4)}`;
    }
    return phone;
  },

  getInitials: (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  truncateText: (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },
};

// Utilitários para status
export const statusUtils = {
  getStatusLabel: (status: number | string) => {
    if (typeof status === "string") {
      const labels = {
        ativo: "Ativo",
        inativo: "Inativo",
        lead: "Lead",
      };
      return labels[status as keyof typeof labels] || status;
    }

    const labels = {
      0: "Cadastrado",
      1: "Reunião",
      2: "Proposta",
      3: "Atendimento",
    };
    return labels[status as keyof typeof labels] || "Desconhecido";
  },

  getStatusColor: (status: number | string) => {
    if (typeof status === "string") {
      const colors = {
        ativo: { background: "#dcfce7", text: "#166534" },
        inativo: { background: "#3d1515", text: "#991b1b" },
        lead: { background: "#fef3c7", text: "#92400e" },
      };
      return (
        colors[status as keyof typeof colors] || {
          background: "#1e1e3a",
          text: "#a0aec0",
        }
      );
    }

    const colors = {
      0: { background: "#e0e7ff", text: "#3730a3" },
      1: { background: "#ddd6fe", text: "#5b21b6" },
      2: { background: "#fef3c7", text: "#92400e" },
      3: { background: "#dcfce7", text: "#166534" },
    };
    return (
      colors[status as keyof typeof colors] || {
        background: "#1e1e3a",
        text: "#a0aec0",
      }
    );
  },

  getLeadColor: (lead: string) => {
    const colors = {
      quente: { bg: "#fef3c7", text: "#92400e" },
      morno: { bg: "#ddd6fe", text: "#5b21b6" },
      frio: { bg: "#3d1515", text: "#991b1b" },
    };
    return (
      colors[lead as keyof typeof colors] || { bg: "#1e1e3a", text: "#a0aec0" }
    );
  },

  getPorteColor: (porte: string) => {
    const colors = {
      grande: { bg: "#dcfce7", text: "#166534" },
      media: { bg: "#fef3c7", text: "#92400e" },
      pequena: { bg: "#e0e7ff", text: "#3730a3" },
    };
    return (
      colors[porte as keyof typeof colors] || { bg: "#1e1e3a", text: "#a0aec0" }
    );
  },
};

// Utilitários para dados mockados
export const mockData = {
  usuarios: [
    {
      id: 1,
      nome: "Diego Silva",
      login: "diego",
      email: "diego@filmelab.com",
      funcao: "Gerente",
      notificacoesAtivadas: true,
      diasAntesContato: 1,
      criadoEm: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      atualizadoEm: new Date().toISOString(),
    },
    {
      id: 2,
      nome: "Ana Santos",
      login: "ana.santos",
      email: "ana@filmelab.com",
      funcao: "Vendedor",
      notificacoesAtivadas: true,
      diasAntesContato: 2,
      criadoEm: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      atualizadoEm: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      nome: "João Costa",
      login: "joao.costa",
      email: "joao@filmelab.com",
      funcao: "Desenvolvedor",
      notificacoesAtivadas: false,
      diasAntesContato: 1,
      criadoEm: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      atualizadoEm: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  ],

  empresas: [
    {
      id: 1,
      nome: "TechCorp Solutions",
      porte: "grande",
      site: "www.techcorp.com",
      marcas: "TechCorp, TechSolutions, TechPro",
      observacoes: "Cliente estratégico com potencial de crescimento.",
      contatos: 12,
      status: 2,
    },
    {
      id: 2,
      nome: "Digital Marketing Pro",
      porte: "media",
      site: "www.digitalmarketing.com",
      marcas: "DigiMarketing, ProMarketing",
      observacoes: "Especializada em marketing digital para PMEs.",
      contatos: 6,
      status: 1,
    },
    {
      id: 3,
      nome: "Startup Innovation",
      porte: "pequena",
      site: "www.startupinnovation.com",
      marcas: "StartupInn",
      observacoes: "Startup em crescimento acelerado.",
      contatos: 3,
      status: 0,
    },
  ],

  contatos: [
    {
      id: 1,
      nome: "João Silva",
      empresaId: 1,
      empresa: "TechCorp Solutions",
      cargo: "CTO",
      telefone: "(11) 99999-9999",
      email: "joao.silva@techcorp.com",
      linkedin: "linkedin.com/in/joaosilva",
      lead: "quente",
      proximoContato: 2,
      numContatos: 3,
      status: 2,
      observacoes:
        "Decisor técnico principal. Interessado em nossa nova solução de IA.",
    },
    {
      id: 2,
      nome: "Maria Santos",
      empresaId: 1,
      empresa: "TechCorp Solutions",
      cargo: "Gerente de TI",
      telefone: "(11) 88888-8888",
      email: "maria.santos@techcorp.com",
      linkedin: "linkedin.com/in/mariasantos",
      lead: "morno",
      proximoContato: 5,
      numContatos: 1,
      status: 1,
      observacoes:
        "Responsável pela implementação. Aguardando aprovação do orçamento.",
    },
  ],

  timeline: [
    {
      id: 1,
      usuario: "Diego Silva",
      contato: "João Silva",
      empresa: "TechCorp Solutions",
      atividade: "Reunião realizada",
      horario: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      usuario: "Ana Santos",
      contato: "Maria Santos",
      empresa: "Digital Marketing Pro",
      atividade: "Proposta enviada",
      horario: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// Dashboard utilities
export * from "./dashboardUtils";
