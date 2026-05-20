// Configurações de ambiente centralizadas
// Next.js expõe variáveis com prefixo NEXT_PUBLIC_ no browser

export const ENV = {
  // URL da API - usa variável de ambiente ou fallback para /api (proxy reverso)
  API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Modo de desenvolvimento
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Log apenas em desenvolvimento
if (ENV.isDevelopment) {
  console.log("🔧 Configurações de ambiente:", ENV);
}
