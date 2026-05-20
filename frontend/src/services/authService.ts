import axios from "axios";
import { ENV } from "../config/env";

// Usa variável de ambiente NEXT_PUBLIC_API_URL
const API_BASE_URL = ENV.API_URL;
console.log("🌐 Auth Service usando URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginData {
  login: string;
  senha: string;
}

export interface CadastroData {
  login: string;
  nome: string;
  senha: string;
  email: string;
  funcao: string;
  notificacoesAtivadas?: boolean;
  diasAntesNotificacao?: number;
}

export interface AuthResponse {
  access_token: string;
  usuario: {
    id: string;
    login: string;
    nome: string;
    email: string;
    funcao: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    console.log("🔐 Fazendo login com:", data.login);
    const response = await api.post("/auth/login", data);
    console.log("✅ Login realizado com sucesso");
    return response.data;
  },

  async cadastro(data: CadastroData): Promise<AuthResponse> {
    console.log("📝 Fazendo cadastro para:", data.nome);
    const response = await api.post("/auth/cadastro", data);
    console.log("✅ Cadastro realizado com sucesso");
    return response.data;
  },

  async recuperarSenha(email: string): Promise<{ message: string }> {
    console.log("🔄 Recuperando senha para:", email);
    const response = await api.post("/auth/recuperar-senha", { email });
    console.log("✅ Solicitação de recuperação enviada");
    return response.data;
  },
};
