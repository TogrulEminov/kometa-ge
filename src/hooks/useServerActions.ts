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
import {
  useAction as useSafeAction,
  type HookBaseOptions,
  type InferUseActionHookReturn,
  type SingleInputActionFn,
} from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type ActionResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};

type AdminActionExtraOptions = {
  /** Bir və ya bir neçə React Query cache key */
  invalidateKeys?: string[];
  /** `invalidateKeys: [queryKey]` üçün qısa yazılış */
  queryKey?: string;
  /** Next.js server cache refresh (default: true) */
  refresh?: boolean;
};

export type AdminActionOptions = HookBaseOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> &
  AdminActionExtraOptions;

export function createServerQueryKey(
  name: string,
  params?: QueryParams,
  id?: string | number,
): QueryKey {
  if (id != null) {
    if (params && Object.keys(params).length > 0) {
      return [name, "detail", id, params];
    }
    return [name, "detail", id];
  }
  if (params && Object.keys(params).length > 0) return [name, "list", params];
  return [name, "list"];
}

export async function invalidateQueryKeys(
  client: QueryClient,
  keys?: string[],
) {
  if (keys?.length) {
    await Promise.all(
      keys.map((key) =>
        client.invalidateQueries({ queryKey: [key], exact: false }),
      ),
    );
    return;
  }

  await client.invalidateQueries();
}

/**
 * next-safe-action `useAction` wrapper.
 * - `execute` awaits `executeAsync` (AdminTable və digər await axınları üçün)
 * - uğurlu mutation-dan sonra React Query cache invalidate olunur
 * - Next.js server cache üçün `router.refresh()` çağırılır
 */
type AnySafeAction = SingleInputActionFn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

export function useAdminAction<TAction extends AnySafeAction>(
  safeActionFn: TAction,
  opts?: AdminActionOptions,
): Omit<InferUseActionHookReturn<TAction>, "execute"> & {
  execute: InferUseActionHookReturn<TAction>["executeAsync"];
} {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    invalidateKeys,
    queryKey,
    refresh = true,
    onSuccess,
    ...rest
  } = opts ?? {};

  const keysToInvalidate =
    invalidateKeys ?? (queryKey ? [queryKey] : undefined);

  const hookResult = useSafeAction(safeActionFn, {
    ...rest,
    onSuccess: async (args) => {
      await invalidateQueryKeys(queryClient, keysToInvalidate);
      if (refresh) {
        router.refresh();
      }
      await onSuccess?.(args);
    },
  });

  const execute = useCallback(
    (input: Parameters<typeof hookResult.executeAsync>[0]) =>
      hookResult.executeAsync(input),
    [hookResult],
  );

  return {
    ...hookResult,
    execute,
  } as Omit<InferUseActionHookReturn<TAction>, "execute"> & {
    execute: InferUseActionHookReturn<TAction>["executeAsync"];
  };
}

export { useAdminAction as useAction };

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
        await invalidateQueryKeys(queryClient, invalidateKeys);
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
