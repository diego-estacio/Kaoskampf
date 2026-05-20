/**
 * Utilitários para filtros avançados
 */

interface FiltrosContato {
  status: string[];
  temperaturas: string[];
}

/**
 * Filtra contatos baseado em múltiplos critérios (status e temperatura)
 * - Se nenhum filtro selecionado, retorna todos
 * - Dentro de cada categoria usa OR (qualquer status OU qualquer temperatura)
 * - Entre categorias usa AND (deve passar em status E temperatura se ambos ativos)
 */
export const filtrarContatosAvancado = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contatos: any[],
  filtros: FiltrosContato
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] => {
  return contatos.filter((contato) => {
    const temFiltroStatus = filtros.status.length > 0;
    const temFiltroTemp = filtros.temperaturas.length > 0;

    // Se nenhum filtro selecionado, mostrar todos
    if (!temFiltroStatus && !temFiltroTemp) {
      return true;
    }

    // Verificar se passa no filtro de status (OR dentro da categoria)
    // Converte status para string pois backend retorna como número
    const passaStatus =
      !temFiltroStatus || filtros.status.includes(String(contato.status));

    // Verificar se passa no filtro de temperatura (OR dentro da categoria)
    const passaTemp =
      !temFiltroTemp || filtros.temperaturas.includes(contato.leadTemperatura);

    // Contato precisa passar em AMBOS os filtros ativos (AND entre categorias)
    return passaStatus && passaTemp;
  });
};
