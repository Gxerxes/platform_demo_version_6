import { keepPreviousData, useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import type { PageRequest, PageResponse } from '../pagination';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, resolvePageRequest } from '../pagination';

export interface UsePaginatedQueryOptions<TData, TError = Error> extends Omit<
  UseQueryOptions<PageResponse<TData>, TError, PageResponse<TData>, QueryKey>,
  'queryKey' | 'queryFn' | 'placeholderData'
> {
  queryKey: QueryKey;
  queryFn: (pageRequest: Required<PageRequest>) => Promise<PageResponse<TData>>;
  initialPage?: number;
  initialPageSize?: number;
}

export function usePaginatedQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  initialPage = DEFAULT_PAGE,
  initialPageSize = DEFAULT_PAGE_SIZE,
  ...queryOptions
}: UsePaginatedQueryOptions<TData, TError>) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pageRequest = useMemo(
    () => resolvePageRequest({ page, pageSize }),
    [page, pageSize],
  );

  const query = useQuery({
    ...queryOptions,
    queryKey: [...queryKey, pageRequest],
    queryFn: () => queryFn(pageRequest),
    placeholderData: keepPreviousData,
  });

  const nextPage = useCallback(() => {
    setPage((current) => current + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((current) => Math.max(DEFAULT_PAGE, current - 1));
  }, []);

  const updatePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(DEFAULT_PAGE);
  }, []);

  const data = query.data;

  return {
    ...query,
    page: pageRequest.page,
    pageSize: pageRequest.pageSize,
    setPage,
    setPageSize: updatePageSize,
    nextPage,
    previousPage,
    items: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
  };
}
