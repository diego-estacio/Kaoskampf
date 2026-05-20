import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  LoginData,
  CadastroData,
  AuthResponse,
  Usuario,
  Empresa,
  Contato,
  Timeline,
  CriarEmpresaData,
  AtualizarEmpresaData,
  CriarContatoData,
  AtualizarContatoData,
  FiltrosContato,
  Observacao,
  NotificacaoContato,
  Marca,
  CatalogoItem,
  CriarCatalogoItemData,
  AtualizarCatalogoItemData,
  Proposta,
  CriarPropostaData,
  AtualizarPropostaData,
  StatusProposta,
  UsuarioRole,
} from "../types";
import { ENV } from "../config/env";

// Função auxiliar para decodificar JWT
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("❌ Erro ao decodificar JWT:", error);
    return null;
  }
}

// Função para verificar se o token está expirado
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

class ApiService {
  public api: AxiosInstance;
  private isRedirecting = false;

  constructor() {
    // Usa variável de ambiente ou fallback para /api (proxy reverso)
    const baseURL = ENV.API_URL;
    console.log("🌐 API Base URL:", baseURL);

    this.api = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // DEBUG: Log para verificar se o baseURL está correto
    console.log(
      "🔧 Axios instance criada com baseURL:",
      this.api.defaults.baseURL,
    );

    // Interceptor para adicionar token de autenticação e verificar expiração
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("kaoskampf_token");

      if (token) {
        // Verifica se o token está expirado antes de fazer a requisição
        if (isTokenExpired(token)) {
          console.log(
            "⏰ Token expirado detectado - redirecionando para login",
          );
          this.handleExpiredToken();
          return Promise.reject(new Error("Token expirado"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros de autenticação
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !this.isRedirecting) {
          console.log("🚨 401 detectado - token inválido ou expirado");
          this.handleExpiredToken();
        }
        return Promise.reject(error);
      },
    );
  }

  private handleExpiredToken() {
    // Evita múltiplos redirecionamentos simultâneos
    if (this.isRedirecting) {
      return;
    }

    this.isRedirecting = true;

    // Limpa os dados de autenticação
    localStorage.removeItem("kaoskampf_token");
    localStorage.removeItem("kaoskampf_user");
    document.cookie =
      "kaoskampf-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redireciona apenas se não estiver já na página de login
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      console.log("🔄 Redirecionando para login...");
      window.location.href = "/login";
    }
  }

  // Métodos de Autenticação
  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/login",
      data,
    );
    return response.data;
  }

  async cadastro(data: CadastroData): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.post(
      "/auth/cadastro",
      data,
    );
    return response.data;
  }

  async esqueceuSenha(email: string): Promise<void> {
    await this.api.post("/auth/esqueceu-senha", { email });
  }

  async redefinirSenha(token: string, novaSenha: string): Promise<void> {
    await this.api.post("/auth/redefinir-senha", { token, novaSenha });
  }

  // Métodos de Usuário
  async buscarUsuarios(): Promise<Usuario[]> {
    const response: AxiosResponse<Usuario[]> = await this.api.get("/usuarios");
    return response.data;
  }

  async buscarUsuario(id: string): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.get(
      `/usuarios/${id}`,
    );
    return response.data;
  }

  async atualizarPerfil(id: string, data: Partial<Usuario>): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.put(
      `/usuarios/${id}`,
      data,
    );
    return response.data;
  }

  async atualizarRoleUsuario(id: string, role: UsuarioRole): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.put(
      `/usuarios/${id}/role`,
      { role },
    );
    return response.data;
  }

  async autorizarUsuario(id: string, autorizado: boolean): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.patch(
      `/usuarios/${id}/autorizar`,
      { autorizado },
    );
    return response.data;
  }

  // Métodos de Empresa
  async criarEmpresa(data: CriarEmpresaData): Promise<Empresa> {
    const response: AxiosResponse<Empresa> = await this.api.post(
      "/empresas",
      data,
    );
    return response.data;
  }

  async buscarEmpresas(): Promise<Empresa[]> {
    const response: AxiosResponse<Empresa[]> = await this.api.get("/empresas");
    return response.data;
  }

  async buscarEmpresasKanban(): Promise<Empresa[]> {
    const response: AxiosResponse<Empresa[]> =
      await this.api.get("/empresas/kanban");
    return response.data;
  }

  async buscarEmpresa(id: string): Promise<Empresa> {
    const response: AxiosResponse<Empresa> = await this.api.get(
      `/empresas/${id}`,
    );
    return response.data;
  }

  async atualizarEmpresa(
    id: string,
    data: AtualizarEmpresaData,
  ): Promise<Empresa> {
    const response: AxiosResponse<Empresa> = await this.api.put(
      `/empresas/${id}`,
      data,
    );
    return response.data;
  }

  async deletarEmpresa(id: string): Promise<void> {
    await this.api.delete(`/empresas/${id}`);
  }

  // Métodos de Contato
  async criarContato(data: CriarContatoData): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.post(
      "/contatos",
      data,
    );
    return response.data;
  }

  async buscarContatos(): Promise<Contato[]> {
    const response: AxiosResponse<Contato[]> = await this.api.get("/contatos");
    return response.data;
  }

  async filtrarContatos(filtros: FiltrosContato): Promise<Contato[]> {
    const params = new URLSearchParams();

    if (filtros.nome) params.append("nome", filtros.nome);
    if (filtros.empresaId) params.append("empresaId", filtros.empresaId);
    if (filtros.status?.length)
      params.append("status", filtros.status.join(","));
    if (filtros.lead?.length) params.append("lead", filtros.lead.join(","));

    const response: AxiosResponse<Contato[]> = await this.api.get(
      `/contatos/filtrar?${params}`,
    );
    return response.data;
  }

  async buscarProximosContatos(dias: number): Promise<Contato[]> {
    const response: AxiosResponse<Contato[]> = await this.api.get(
      `/contatos/proximos/${dias}`,
    );
    return response.data;
  }

  async buscarContato(id: string): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.get(
      `/contatos/${id}`,
    );
    return response.data;
  }

  async atualizarContato(
    id: string,
    data: AtualizarContatoData,
  ): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.put(
      `/contatos/${id}`,
      data,
    );
    return response.data;
  }

  async deletarContato(id: string): Promise<void> {
    await this.api.delete(`/contatos/${id}`);
  }

  async atualizarTipoContato(
    id: string,
    tipoContato: "lead" | "cliente",
  ): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.patch(
      `/contatos/${id}/tipo`,
      { tipoContato },
    );
    return response.data;
  }

  async marcarContato(id: string, observacao?: string): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.put(
      `/contatos/${id}/marcar-contato`,
      {
        observacao,
      },
    );
    return response.data;
  }

  // Métodos de Timeline
  async buscarTimelineRecente(limite?: number): Promise<Timeline[]> {
    const params = limite ? `?limite=${limite}` : "";
    const response: AxiosResponse<Timeline[]> = await this.api.get(
      `/timeline${params}`,
    );
    return response.data;
  }

  async buscarTimelineUsuario(
    usuarioId: string,
    limite?: number,
  ): Promise<Timeline[]> {
    const params = limite ? `?limite=${limite}` : "";
    const response: AxiosResponse<Timeline[]> = await this.api.get(
      `/timeline/usuario/${usuarioId}${params}`,
    );
    return response.data;
  }

  async buscarTimelineContato(contatoId: string): Promise<Timeline[]> {
    const response: AxiosResponse<Timeline[]> = await this.api.get(
      `/timeline/contato/${contatoId}`,
    );
    return response.data;
  }

  // Método para criar contato via API externa (endpoint público)
  async criarContatoExterno(data: CriarContatoData): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.post(
      "/contatos/externo",
      data,
    );
    return response.data;
  }

  // Observações
  async criarObservacao(contatoId: string, texto: string): Promise<Observacao> {
    const response: AxiosResponse<Observacao> = await this.api.post(
      `/contatos/${contatoId}/observacoes`,
      {
        texto,
      },
    );
    return response.data;
  }

  async buscarObservacoes(contatoId: string): Promise<Observacao[]> {
    const response: AxiosResponse<Observacao[]> = await this.api.get(
      `/contatos/${contatoId}/observacoes`,
    );
    return response.data;
  }

  // Atualizar status do contato
  async atualizarStatusContato(
    contatoId: string,
    status: string,
  ): Promise<Contato> {
    const response: AxiosResponse<Contato> = await this.api.patch(
      `/contatos/${contatoId}/status`,
      { status },
    );
    return response.data;
  }

  // ============================================
  // UTILITÁRIOS ADMINISTRATIVOS DE CONTATOS
  // ============================================

  async recalcularLeadETipoContato(): Promise<{
    total: number;
    atualizados: number;
  }> {
    const response: AxiosResponse<{ total: number; atualizados: number }> =
      await this.api.post("/contatos/recalcular-lead-tipo");
    return response.data;
  }

  // ============================================
  // NOTIFICAÇÕES
  // ============================================

  async contarNotificacoes(): Promise<number> {
    const response: AxiosResponse<{ count: number }> = await this.api.get(
      "/notificacoes/count",
    );
    return response.data.count;
  }

  async buscarNotificacoes(): Promise<NotificacaoContato[]> {
    const response: AxiosResponse<NotificacaoContato[]> =
      await this.api.get("/notificacoes");
    return response.data;
  }

  async deletarNotificacao(notificacaoId: string): Promise<void> {
    // Em vez de deletar fisicamente, marcamos como visualizada
    await this.api.patch(`/notificacoes/${notificacaoId}/visualizada`);
  }

  async marcarNotificacaoVisualizada(notificacaoId: string): Promise<void> {
    await this.api.patch(`/notificacoes/${notificacaoId}/visualizada`);
  }

  // ============================================
  // MARCAS
  // ============================================

  async buscarMarcas(): Promise<Marca[]> {
    const response: AxiosResponse<Marca[]> = await this.api.get("/marcas");
    return response.data;
  }

  async buscarMarcaPorId(id: number): Promise<Marca> {
    const response: AxiosResponse<Marca> = await this.api.get(`/marcas/${id}`);
    return response.data;
  }

  async atualizarIconeMarca(id: number, icon: string): Promise<Marca> {
    const response: AxiosResponse<Marca> = await this.api.put(`/marcas/${id}`, {
      icon,
    });
    return response.data;
  }

  async buscarEmpresasPorMarca(marcaId: string): Promise<Empresa[]> {
    const response: AxiosResponse<Empresa[]> = await this.api.get(
      `/marcas/${marcaId}/empresas`,
    );
    return response.data;
  }

  // ============================================
  // CATÁLOGO DE SERVIÇOS
  // ============================================

  async listarCatalogoItensTodos(tipo?: string): Promise<CatalogoItem[]> {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response: AxiosResponse<CatalogoItem[]> = await this.api.get(
      `/catalogo${query}`,
    );
    return response.data;
  }

  async listarCatalogoItens(
    marcaId: number,
    tipo?: string,
  ): Promise<CatalogoItem[]> {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response: AxiosResponse<CatalogoItem[]> = await this.api.get(
      `/catalogo/marca/${marcaId}${query}`,
    );
    return response.data;
  }

  async listarCatalogoTiposTodos(): Promise<string[]> {
    const response: AxiosResponse<string[]> =
      await this.api.get(`/catalogo/tipos`);
    return response.data;
  }

  async listarCatalogoTipos(marcaId: number): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get(
      `/catalogo/marca/${marcaId}/tipos`,
    );
    return response.data;
  }

  async criarCatalogoItem(data: CriarCatalogoItemData): Promise<CatalogoItem> {
    const response: AxiosResponse<CatalogoItem> = await this.api.post(
      "/catalogo",
      data,
    );
    return response.data;
  }

  async atualizarCatalogoItem(
    id: string,
    data: AtualizarCatalogoItemData,
  ): Promise<CatalogoItem> {
    const response: AxiosResponse<CatalogoItem> = await this.api.put(
      `/catalogo/${id}`,
      data,
    );
    return response.data;
  }

  async deletarCatalogoItem(id: string): Promise<void> {
    await this.api.delete(`/catalogo/${id}`);
  }

  // ============================================
  // PROPOSTAS
  // ============================================

  async listarPropostas(filtros?: {
    contatoId?: string;
    empresaId?: string;
  }): Promise<Proposta[]> {
    const params = new URLSearchParams();

    if (filtros?.contatoId) params.append("contatoId", filtros.contatoId);
    if (filtros?.empresaId) params.append("empresaId", filtros.empresaId);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response: AxiosResponse<Proposta[]> = await this.api.get(
      `/propostas${query}`,
    );
    return response.data;
  }

  async listarPropostasPorContato(contatoId: string): Promise<Proposta[]> {
    const response: AxiosResponse<Proposta[]> = await this.api.get(
      `/propostas/contato/${contatoId}`,
    );
    return response.data;
  }

  async buscarProposta(id: string): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await this.api.get(
      `/propostas/${id}`,
    );
    return response.data;
  }

  // Método público para visualização de propostas (sem autenticação)
  async buscarPropostaPublica(id: string): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await axios.get(
      `${this.api.defaults.baseURL}/propostas/${id}`,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  }

  async criarProposta(data: CriarPropostaData): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await this.api.post(
      "/propostas",
      data,
    );
    return response.data;
  }

  async sugerirPropostaIA(
    descricao: string,
    marcaId?: number | null,
  ): Promise<{
    titulo: string;
    introducao: string;
    itens: {
      itemCatalogoId: string;
      nome: string;
      descricao: string;
      quantidade: number;
      pricingTier: "G" | "M" | "P";
      justificativa: string;
    }[];
    observacoes: string;
  }> {
    const response = await this.api.post(
      "/propostas/ia/sugerir",
      {
        descricao,
        marcaId,
      },
      { timeout: 120000 },
    );
    return response.data;
  }

  async atualizarProposta(
    id: string,
    data: AtualizarPropostaData,
  ): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await this.api.put(
      `/propostas/${id}`,
      data,
    );
    return response.data;
  }

  async atualizarStatusProposta(
    id: string,
    status: StatusProposta,
  ): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await this.api.patch(
      `/propostas/${id}/status`,
      { status },
    );
    return response.data;
  }

  async duplicarProposta(id: string): Promise<Proposta> {
    const response: AxiosResponse<Proposta> = await this.api.post(
      `/propostas/${id}/duplicar`,
    );
    return response.data;
  }

  // ============================================
  // PLANNER
  // ============================================
  async gerarLinkPlanner(): Promise<{ url: string }> {
    const response = await this.api.get("/api/ir-para-planner");
    return response.data;
  }
}

export const apiService = new ApiService();
export const api = apiService.api;
export default apiService;
