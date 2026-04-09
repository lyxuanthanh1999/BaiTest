/**
 * ============================================================
 * TEMPLATE QUERIES — Copy file này để tạo queries mới
 * ============================================================
 *
 * Cách dùng:
 * 1. Copy file này → đổi tên (vd: orderQueries.ts)
 * 2. Thay "template" → tên resource (vd: "order")
 * 3. Thay templateApi → import API tương ứng
 * 4. Xoá những hook không cần
 *
 * Trong component:
 *   const { data, isLoading, error } = templateQueries.useList();
 *   const createMutation = templateQueries.useCreate();
 *   createMutation.mutate(newItem);
 */

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { Logger } from '@/shared/helper';

// TODO: Thay bằng API thực tế
// import { templateApi } from '../api/templateApi';

// ─── QUERY KEYS ─────────────────────────────────────────────
// Tập trung key ở 1 chỗ để dễ invalidate
const QUERY_KEYS = {
    all: ['template'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
    details: () => [...QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

const templateQueries = {
    // ─── GET LIST ───────────────────────────────────────────
    // Tự động fetch khi component mount
    // Component: const { data, isLoading, error, refetch } = templateQueries.useList();
    useList: () => {
        return useQuery({
            queryKey: QUERY_KEYS.lists(),
            queryFn: async () => {
                // TODO: return templateApi.getList();
                return [];
            },
            staleTime: 5 * 60 * 1000,      // data tươi 5 phút
            // retry: 2,                    // retry 2 lần nếu fail
            // enabled: true,              // false = không tự fetch
            // refetchOnWindowFocus: true,  // refetch khi quay lại app
            // refetchInterval: 30_000,    // polling mỗi 30s
            // placeholderData: [],         // data tạm trước khi fetch xong
        });
    },

    // ─── GET DETAIL BY ID ───────────────────────────────────
    // Component: const { data } = templateQueries.useDetail('123');
    useDetail: (id: string) => {
        return useQuery({
            queryKey: QUERY_KEYS.detail(id),
            queryFn: async () => {
                // TODO: return templateApi.getDetail(id);
                return null;
            },
            enabled: !!id,  // chỉ fetch khi có id
        });
    },

    // ─── CREATE (POST) ─────────────────────────────────────
    // Component:
    //   const create = templateQueries.useCreate();
    //   create.mutate(newItem);                    // fire-and-forget
    //   await create.mutateAsync(newItem);         // async/await
    //   create.isPending → loading state
    useCreate: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (newItem: unknown) => {
                // TODO: return templateApi.create(newItem);
                return newItem;
            },
            onSuccess: () => {
                // Invalidate list → tự refetch data mới nhất
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
            },
            onError: (error) => {
                Logger.error('TemplateQueries', 'Create failed', error.message);
            },
        });
    },

    // ─── UPDATE (PUT/PATCH) ─────────────────────────────────
    // Component:
    //   const update = templateQueries.useUpdate();
    //   update.mutate({ id: '123', name: 'new name' });
    useUpdate: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (item: { id: string; [key: string]: unknown }) => {
                // TODO: return templateApi.update(item.id, item);
                return item;
            },
            onSuccess: (_data, variables) => {
                // Invalidate cả list và detail của item vừa update
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
            },
            onError: (error) => {
                Logger.error('TemplateQueries', 'Update failed', error.message);
            },
        });
    },

    // ─── DELETE ─────────────────────────────────────────────
    // Component:
    //   const remove = templateQueries.useDelete();
    //   remove.mutate('item-id-123');
    useDelete: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (id: string) => {
                // TODO: return templateApi.delete(id);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
            },
            onError: (error) => {
                Logger.error('TemplateQueries', 'Delete failed', error.message);
            },
        });
    },

    // ─── OPTIMISTIC UPDATE (cập nhật UI ngay, rollback nếu fail) ──
    // Component: dùng giống useUpdate
    useOptimisticUpdate: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (item: { id: string; [key: string]: unknown }) => {
                // TODO: return templateApi.update(item.id, item);
                return item;
            },
            onMutate: async (newItem) => {
                // 1. Cancel queries đang chạy
                await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists() });

                // 2. Lưu data cũ để rollback
                const previousData = queryClient.getQueryData(QUERY_KEYS.lists());

                // 3. Cập nhật cache ngay (optimistic)
                queryClient.setQueryData(QUERY_KEYS.lists(), (old: unknown[]) =>
                    old?.map((item: any) => (item.id === newItem.id ? { ...item, ...newItem } : item)),
                );

                return { previousData }; // context cho onError
            },
            onError: (_error, _variables, context) => {
                // Rollback về data cũ
                if (context?.previousData) {
                    queryClient.setQueryData(QUERY_KEYS.lists(), context.previousData);
                }
            },
            onSettled: () => {
                // Luôn refetch để đồng bộ với server
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
            },
        });
    },

    // ─── INFINITE QUERY (pagination vô hạn / load more) ────
    // Component:
    //   const { data, fetchNextPage, hasNextPage, isFetchingNextPage }
    //       = templateQueries.useInfiniteList();
    //   data.pages → mảng các page
    //   data.pages.flatMap(p => p.items) → tất cả items
    useInfiniteList: () => {
        return useInfiniteQuery({
            queryKey: [...QUERY_KEYS.lists(), 'infinite'],
            queryFn: async ({ pageParam = 1 }) => {
                // TODO: return templateApi.getList({ page: pageParam, limit: 20 });
                return { items: [], nextPage: null as number | null };
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        });
    },
};

export default templateQueries;

/**
 * ============================================================
 * CHEAT SHEET — Sử dụng trong Component
 * ============================================================
 *
 * --- useQuery (GET) ---
 * const { data, isLoading, isFetching, isError, error, refetch } = templateQueries.useList();
 * if (isLoading) return <Loading />;
 * if (isError) return <Error message={error.message} />;
 * return <FlatList data={data} ... />;
 *
 * --- useMutation (POST/PUT/DELETE) ---
 * const createMutation = templateQueries.useCreate();
 *
 * // Fire-and-forget:
 * createMutation.mutate(newItem);
 *
 * // Async/await:
 * try {
 *     const result = await createMutation.mutateAsync(newItem);
 * } catch (e) { }
 *
 * // Loading state:
 * <Button disabled={createMutation.isPending} />
 *
 * // Error:
 * {createMutation.isError && <Text>{createMutation.error.message}</Text>}
 *
 * --- useInfiniteQuery (Load more) ---
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = templateQueries.useInfiniteList();
 * <FlatList
 *     data={data?.pages.flatMap(p => p.items)}
 *     onEndReached={() => hasNextPage && fetchNextPage()}
 *     ListFooterComponent={isFetchingNextPage ? <Loading /> : null}
 * />
 */
