// UTILITÁRIO DE API CENTRALIZADO - SEMPRE FUNCIONA
import { ENV } from "../config/env";

const API_BASE_URL = ENV.API_URL;

console.log("🌐 API Utilitário carregado com URL:", API_BASE_URL);

// Função para fazer requisições com fetch nativo
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("🚀 Fazendo requisição para:", url);

  // Adicionar token se disponível
  const token = localStorage.getItem("kaoskampf_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📡 Resposta ${response.status} para ${endpoint}`);

    // Se for 401, apenas logar (não remover token automaticamente)
    if (response.status === 401) {
      console.log("🚨 401 Unauthorized - Token pode estar inválido");
    }

    return response;
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    throw error;
  }
};

// Métodos de conveniência
export const apiGet = (endpoint: string) =>
  apiRequest(endpoint, { method: "GET" });

export const apiPost = (endpoint: string, data?: unknown) =>
  apiRequest(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = (endpoint: string, data?: unknown) =>
  apiRequest(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPatch = (endpoint: string, data?: unknown) =>
  apiRequest(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = (endpoint: string) =>
  apiRequest(endpoint, { method: "DELETE" });

// Função para testar conectividade
export const testConnection = async () => {
  try {
    await apiGet("/");
    console.log("✅ Conexão com API funcionando");
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão com API:", error);
    return false;
  }
};
