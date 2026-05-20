// Utilitários para gerenciamento de status de empresas

export interface StatusColor {
  bg: string;
  text: string;
}

/**
 * Calcula o status mais avançado dos contatos de uma empresa
 */
export const calcularStatusEmpresa = (
  contatos: Array<{ status: string | number }>,
): number => {
  if (contatos.length === 0) return 0; // Cadastrado por padrão

  // Encontrar o status mais alto (mais avançado)
  const statusMaisAlto = Math.max(
    ...contatos.map((c) => parseInt(c.status.toString()) || 0),
  );
  return statusMaisAlto;
};

/**
 * Retorna o label do status da empresa
 */
export const obterLabelStatus = (status: number): string => {
  const statusLabels: { [key: number]: string } = {
    0: "Cadastrado",
    2: "Reunião",
    3: "Proposta",
    4: "Atendimento",
  };
  return statusLabels[status] || "Cadastrado";
};

/**
 * Retorna as cores (background e texto) do status da empresa
 */
export const obterCorStatus = (status: number): StatusColor => {
  const statusCores: { [key: number]: StatusColor } = {
    0: { bg: "rgba(139, 92, 246, 0.18)", text: "#c4b5fd" }, // Cadastrado - roxo
    2: { bg: "rgba(234, 179, 8, 0.18)", text: "#fde047" }, // Reunião - amarelo
    3: { bg: "rgba(255, 128, 0, 0.18)", text: "#fdba74" }, // Proposta - laranja
    4: { bg: "rgba(16, 185, 129, 0.18)", text: "#6ee7b7" }, // Atendimento - verde
  };
  return statusCores[status] || statusCores[0];
};

/**
 * Retorna todas as informações do status (label e cores)
 */
export const obterInfoStatus = (status: number) => {
  return {
    label: obterLabelStatus(status),
    colors: obterCorStatus(status),
  };
};
