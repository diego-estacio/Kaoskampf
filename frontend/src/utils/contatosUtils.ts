import { apiService } from "../services/api";
import {
  LeadTemperatura,
  StatusContato,
  NotificacaoContato,
  Marca,
} from "../types";

// Interfaces
export interface Empresa {
  id: string;
  nome: string;
  porte: "pequeno" | "medio" | "grande";
  site?: string;
  marcas?: Marca[];
  observacoes?: string;
  contatos?: Contato[]; // Contatos vinculados à empresa
  status?: number; // Status calculado baseado nos contatos
  ultimoContato?: string; // Data do último contato realizado
  numeroContatos?: number; // Total de contatos vinculados
}

export interface Contato {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  status: string;
  observacoes: string;
  leadTemperatura: string;
  ultimoContato: string;
  proximoContato: string;
  tipoContato?: "lead" | "cliente";
  criadoEm?: string; // ✅ Data de criação do contato
  numeroContatos?: number; // Número de contatos realizados
  ultimoContatoRealizado?: string; // ✅ Data da última tentativa de contato
  empresa: {
    id?: string;
    nome: string;
  };
  contatos?: {
    telefone?: string;
    email?: string;
    linkedin?: string;
  };
  usuarioCriadorId?: string;
  usuarioCriador?: {
    id: string;
    login: string;
    nome: string;
  };
}

export interface ContatoAPI {
  id: string;
  nome: string;
  cargo?: string;
  observacoes?: string;
  contatos?: {
    telefone?: string;
    email?: string;
    linkedin?: string;
  };
  status?: string;
  lead?: string;
  proximoContato?: string;
  tipoContato?: "lead" | "cliente";
  criadoEm?: string; // ✅ Data de criação do contato
  numeroContatos?: number; // Número de contatos realizados
  ultimoContatoRealizado?: string; // ✅ Data da última tentativa de contato
  empresa?: {
    nome: string;
  };
  usuarioCriadorId?: string;
  usuario_criador_id?: string;
  usuarioCriador?: {
    id: string;
    login: string;
    nome: string;
  };
}

export interface ContatoFormData {
  nome: string;
  empresa: string; // Nome da empresa (para exibir)
  empresaId?: string; // ID da empresa (para salvar)
  cargo: string;
  email: string;
  telefone: string;
  linkedin: string;
  observacoes: string;
  status: string;
  leadTemperatura: string;
  tipoContato?: "lead" | "cliente";
}

// Função para mapear contatos da API para o formato local
export const mapearContatosAPI = (data: ContatoAPI[]): Contato[] => {
  return data.map((contato: ContatoAPI) => {
    console.log(`🔍 DADOS COMPLETOS DO BACKEND - ${contato.nome}:`, contato);
    console.log(`📊 Status: ${contato.status} | Lead: ${contato.lead}`);

    return {
      id: contato.id,
      nome: contato.nome,
      cargo: contato.cargo || "",
      email: contato.contatos?.email || "",
      telefone: contato.contatos?.telefone || "",
      status: contato.status || "0",
      observacoes: contato.observacoes || "",
      leadTemperatura: contato.lead || "morno",
      ultimoContato: new Date().toISOString(),
      proximoContato:
        contato.proximoContato ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias a partir de hoje por padrão
      criadoEm: contato.criadoEm, // ✅ Data de criação do contato
      numeroContatos: contato.numeroContatos || 0, // Número de contatos realizados
      ultimoContatoRealizado: contato.ultimoContatoRealizado, // ✅ Data da última tentativa
      tipoContato: contato.tipoContato || "lead",
      empresa: {
        nome: contato.empresa?.nome || "Sem empresa",
      },
      contatos: contato.contatos,
      usuarioCriadorId: contato.usuarioCriadorId || contato.usuario_criador_id || contato.usuarioCriador?.id,
      usuarioCriador: contato.usuarioCriador,
    };
  });
};

// Função para carregar contatos com fallback para mock
export const carregarContatos = async (): Promise<Contato[]> => {
  try {
    const data = await apiService.buscarContatos();

    // DEBUG: Log dos dados recebidos da API
    console.log("🔍 DEBUG - Dados recebidos da API:", data);

    return mapearContatosAPI(data as unknown as ContatoAPI[]);
  } catch (error) {
    console.error("Erro ao carregar contatos:", error);
    // Fallback para dados mock
    return [
      {
        id: "1",
        nome: "Diego Sanchez",
        cargo: "Desenvolvedor Full Stack",
        email: "diego@techcorp.com",
        telefone: "(11) 99999-9999",
        status: "1",
        observacoes: "Interessado em soluções cloud",
        leadTemperatura: "morno",
        ultimoContato: "2024-01-15T10:30:00Z",
        cliente: { nome: "TechCorp" },
        proximoContato: "2026-01-20T10:30:00Z",
      },
    ];
  }
};

// Função para carregar empresas com fallback para mock
export const carregarEmpresas = async (): Promise<
  { id: string; nome: string }[]
> => {
  try {
    const data = await apiService.buscarEmpresas();
    return data.map((c) => ({ id: c.id, nome: c.nome }));
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
    return [
      { id: "1", nome: "TechCorp" },
      { id: "2", nome: "StartupX" },
      { id: "3", nome: "InovaCorp" },
    ];
  }
};

// Função para converter FormData para dados de contato interno
export const formDataParaContato = (
  formData: ContatoFormData,
  contatoExistente?: Contato,
): Contato => {
  const base = contatoExistente || {
    id: "",
    ultimoContato: new Date().toISOString(),
  };

  return {
    ...base,
    nome: formData.nome,
    cargo: formData.cargo,
    email: formData.email,
    telefone: formData.telefone,
    observacoes: formData.observacoes,
    status: formData.status,
    leadTemperatura: formData.leadTemperatura,
    empresa: {
      id: formData.empresaId, // Incluir ID da empresa para persistir mudança
      nome: formData.empresa,
    },
    contatos: {
      telefone: formData.telefone,
      email: formData.email,
      linkedin: formData.linkedin,
    },
  } as Contato;
};

// Função para converter contato interno para FormData do modal
export const contatoParaFormData = (
  contato: Contato,
  empresas?: Empresa[],
): ContatoFormData => {
  // Tentar encontrar a empresa pelo nome para obter o ID
  const empresaEncontrada = empresas?.find(
    (c) => c.nome === contato.empresa.nome,
  );

  return {
    nome: contato.nome,
    empresa: contato.empresa.nome, // SEMPRE mostrar o nome
    empresaId: empresaEncontrada?.id, // ID para salvar
    cargo: contato.cargo,
    email: contato.email,
    telefone: contato.telefone,
    linkedin: contato.contatos?.linkedin || "",
    observacoes: contato.observacoes,
    status: contato.status,
    leadTemperatura: contato.leadTemperatura,
  };
};

// Função para atualizar contato via API
export const atualizarContatoAPI = async (
  contato: Contato,
  novosDados: Contato,
): Promise<void> => {
  // Obter empresaId do objeto empresa
  let empresaId: string | undefined;
  if (typeof novosDados.empresa === "object" && novosDados.empresa !== null) {
    empresaId = (novosDados.empresa as { id?: string }).id;
  }

  await apiService.atualizarContato(contato.id, {
    nome: novosDados.nome,
    cargo: novosDados.cargo,
    // observacoes removido - agora é tratado na página de detalhes
    contatos: {
      telefone: novosDados.telefone,
      email: novosDados.email,
      linkedin: novosDados.contatos?.linkedin || "",
    },
    status: novosDados.status as unknown as StatusContato,
    // ❌ NÃO enviar lead - deixar o backend calcular automaticamente baseado no status
    // lead: novosDados.leadTemperatura as LeadTemperatura,
    empresaId: empresaId, // Incluir empresaId para persistir mudança de empresa
  });
};

// Função para criar contato via API
export const criarContatoAPI = async (
  formData: ContatoFormData,
  empresas: { id: string; nome: string }[],
): Promise<ContatoAPI> => {
  // Usar empresaId se disponível, senão buscar por nome (backward compatibility)
  let empresaId = formData.empresaId;

  if (!empresaId && formData.empresa) {
    const empresaPorNome = empresas.find((c) => c.nome === formData.empresa);
    empresaId = empresaPorNome?.id;
  }

  const dadosParaEnviar = {
    nome: formData.nome,
    cargo: formData.cargo,
    // observacoes removido - agora é tratado como observação separada
    contatos: {
      telefone: formData.telefone || "",
      email: formData.email || "",
      linkedin: formData.linkedin || "",
    },
    lead: formData.leadTemperatura as LeadTemperatura,
    tipoContato: formData.tipoContato,
    empresaId: empresaId,
    novaEmpresa: empresaId
      ? undefined
      : {
          nome: formData.empresa, // Se não tem empresaId, criar nova empresa
          porte: "pequeno" as const,
        },
  };

  // DEBUG: Log dos dados sendo enviados
  console.log("🔍 DEBUG - Dados sendo enviados para API:", {
    formData,
    empresaId,
    dadosParaEnviar,
  });

  try {
    console.log("🌐 DEBUG - Chamando apiService.criarContato...");
    const resultado = await apiService.criarContato(dadosParaEnviar);
    console.log("✅ DEBUG - Resposta da API:", resultado);

    // Se há observações no formulário, criar a primeira observação
    if (formData.observacoes && formData.observacoes.trim()) {
      console.log("📝 DEBUG - Criando observação inicial...");
      try {
        await apiService.criarObservacao(
          resultado.id,
          formData.observacoes.trim(),
        );
        console.log("✅ DEBUG - Observação inicial criada com sucesso");
      } catch (obsError) {
        console.error("❌ DEBUG - Erro ao criar observação inicial:", obsError);
        // Não falha a criação do contato se a observação der erro
      }
    }

    return resultado as unknown as ContatoAPI;
  } catch (error) {
    console.error("❌ DEBUG - Erro na API criarContato:", error);
    throw error;
  }
};

// Função para filtrar contatos
export const filtrarContatos = (
  contatos: Contato[],
  filtro: string,
): Contato[] => {
  if (filtro === "todos") return contatos;
  if (filtro === "leads")
    return contatos.filter((contato) => contato.leadTemperatura === "quente");
  return contatos.filter((contato) => contato.status === filtro);
};

// ✅ REMOVIDO: formatarDataRelativa - movido para dateUtils.ts
// ✅ REMOVIDO: calcularDiasProximoContato - movido para contactUtils.ts

// ✅ REMOVIDO: criarClienteAPI - função não utilizada em nenhum lugar do código

// Função para obter label do status
export const obterLabelStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    "0": "Cadastrado",

    "2": "Reunião",
    "3": "Proposta",
    "4": "Atendimento",
    cadastrado: "Cadastrado",

    reuniao: "Reunião",
    proposta: "Proposta",
    atendimento: "Atendimento",
  };
  return statusMap[status] || status;
};

// Função para obter opções de status
export const obterOpcoesStatus = () => [
  { value: "0", label: "Cadastrado" },
  { value: "2", label: "Reunião" },
  { value: "3", label: "Proposta" },
  { value: "4", label: "Atendimento" },
];

// Função para obter opções de lead
export const obterOpcoesLead = () => [
  { value: "frio", label: "Frio" },
  { value: "morno", label: "Morno" },
  { value: "quente", label: "Quente" },
];

// Funções de notificação
export const buscarNotificacoes = async (): Promise<NotificacaoContato[]> => {
  try {
    const response = await apiService.buscarNotificacoes();
    return response;
  } catch (error) {
    console.error("❌ Erro ao buscar notificações:", error);
    return [];
  }
};

// ✅ REMOVIDO: marcarContato - função wrapper desnecessária, usar apiService.marcarContato diretamente
