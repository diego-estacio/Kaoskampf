import { useMemo, useState } from "react";

export interface UsePaginationResult<T> {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export function usePagination<T>(
  allItems: T[],
  pageSize: number = 10,
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const { items, totalItems, totalPages } = useMemo(() => {
    const totalItems = allItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return {
      items: allItems.slice(start, end),
      totalItems,
      totalPages,
    };
  }, [allItems, page, pageSize]);

  // Se a lista muda e a página atual fica fora do range, volta para 1
  const safeSetPage = (nextPage: number) => {
    if (!Number.isFinite(nextPage)) return;
    setPage(Math.max(1, Math.floor(nextPage)));
  };

  return {
    page,
    setPage: safeSetPage,
    pageSize,
    totalItems,
    totalPages,
    items,
  };
}
