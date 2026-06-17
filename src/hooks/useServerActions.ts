"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type ActionResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};

export function createServerQueryKey(
  name: string,
  params?: QueryParams,
  id?: string | number,
): QueryKey {
  if (id != null) return [name, "detail", id];
  if (params && Object.keys(params).length > 0) return [name, "list", params];
  return [name, "list"];
}

async function invalidateQueries(client: QueryClient, keys: string[]) {
  await Promise.all(
    keys.map((key) =>
      client.invalidateQueries({ queryKey: [key], exact: false }),
    ),
  );
}

type MutationConfig<TData, TInput> = Omit<
  UseMutationOptions<TData, Error, TInput>,
  "mutationFn"
> & {
  invalidateKeys?: string[];
};

/** CREATE, UPDATE, DELETE server action-ları üçün */
export function useServerAction<TData = unknown, TInput = unknown>(
  actionFn: (input: TInput) => Promise<TData>,
  config?: MutationConfig<TData, TInput>,
) {
  const queryClient = useQueryClient();
  const { invalidateKeys = [], onSuccess, ...options } = config ?? {};

  return useMutation({
    mutationFn: actionFn,
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      if (invalidateKeys.length) {
        await invalidateQueries(queryClient, invalidateKeys);
      }
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}

/** LIST server action-ları üçün */
export function useServerQuery<TData = unknown, TParams = QueryParams>(
  queryName: string,
  actionFn: (params: TParams) => Promise<TData>,
  config?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn"> & {
    params?: TParams;
  },
) {
  const { params, ...options } = config ?? {};
  const queryKey = createServerQueryKey(queryName, params as QueryParams);

  return useQuery({
    queryKey,
    queryFn: () => actionFn(params as TParams),
    ...options,
  });
}

/** GET BY ID server action-ları üçün */
export function useServerQueryById<
  TData = unknown,
  TParams extends { id?: unknown } = QueryParams,
>(
  queryName: string,
  actionFn: (params: TParams) => Promise<ActionResponse<TData>>,
  id: string | number | null | undefined,
  extraParams?: Omit<TParams, "id">,
  config?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">,
) {
  const params = { ...extraParams, id } as TParams;
  const queryKey = createServerQueryKey(
    queryName,
    extraParams as QueryParams,
    id ?? undefined,
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await actionFn(params);
      if (!response.data) {
        throw new Error(response.message ?? "Data not found");
      }
      return response.data;
    },
    enabled: Boolean(id) && config?.enabled !== false,
    ...config,
  });
}
