export interface FiltrosEmpresa {
  status: string[];
  portes: string[];
}

export const OPCOES_STATUS = [
  { value: "0", label: "Cadastrado" },
  { value: "2", label: "Reunião" },
  { value: "3", label: "Proposta" },
  { value: "4", label: "Atendimento" },
];

export const OPCOES_PORTE = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
];
