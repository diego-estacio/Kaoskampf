export interface FiltrosContato {
  status: string[];
  temperaturas: string[];
}

export interface OpcaoFiltro {
  value: string;
  label: string;
  cor?: string;
}

export const OPCOES_STATUS: OpcaoFiltro[] = [
  { value: "0", label: "Cadastrado" },
  { value: "2", label: "Reunião" },
  { value: "3", label: "Proposta" },
  { value: "4", label: "Atendimento" },
  { value: "5", label: "Inativo" },
  { value: "6", label: "Reativado" },
];

export const OPCOES_TEMPERATURA: OpcaoFiltro[] = [
  { value: "quente", label: "Quente", cor: "#2ace53" },
  { value: "morno", label: "Morno", cor: "#f9a11e" },
  { value: "frio", label: "Frio", cor: "#7a66ff" },
  { value: "inativo", label: "Inativo", cor: "#ff1919" },
];
