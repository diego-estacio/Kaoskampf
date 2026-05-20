// Utilitários para formatação de telefone (sem dependências externas)

// Formata telefone brasileiro conforme o número de dígitos digitados
// Exemplos:
//  - 11987654321 -> (11) 98765-4321
//  - 1134567890  -> (11) 3456-7890
//  - 987654321   -> 98765-4321 (sem DDD)
export const formatPhoneBr = (value: string): string => {
  if (!value) return "";

  // Manter apenas dígitos
  const digits = value.replace(/\D/g, "");

  // Se tem DDD + 9 dígitos (11 dígitos no total)
  if (digits.length >= 11) {
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 7);
    const last = digits.slice(7, 11);
    return `(${ddd}) ${first}-${last}`;
  }

  // Se tem DDD + 8 dígitos (10 dígitos)
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 6);
    const last = digits.slice(6, 10);
    return `(${ddd}) ${first}-${last}`;
  }

  // Sem DDD, 9 dígitos
  if (digits.length === 9) {
    const first = digits.slice(0, 5);
    const last = digits.slice(5, 9);
    return `${first}-${last}`;
  }

  // Sem DDD, 8 dígitos
  if (digits.length === 8) {
    const first = digits.slice(0, 4);
    const last = digits.slice(4, 8);
    return `${first}-${last}`;
  }

  // Para menos dígitos, apenas retorna o que há (sem formatação pesada)
  return digits;
};
