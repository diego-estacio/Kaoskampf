/**
 * Utilitários específicos para o ContactModal
 */

export const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    cadastrado: "Cadastrado",
    reuniao: "Reunião",
    proposta: "Proposta",
    fechado: "Fechado",
  };
  return statusMap[status] || status;
};

export const formatarData = (dataString: string): string => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};
