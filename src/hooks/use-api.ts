import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import type { UseQueryOptions, UseMutationOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query'

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get<T>(url)
      return response.data
    },
    ...options,
  })
}

export function useInfiniteApiQuery<TData extends any[]>(
  key: string[],
  url: string,
  options?: Omit<
    UseInfiniteQueryOptions<TData, AxiosError, TData, string[], number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
  >
) {
  return useInfiniteQuery<TData, AxiosError, TData, string[], number>({
    queryKey: key,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<TData>(url, {
        params: { page: pageParam },
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: TData, allPages: TData[]) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined
    },
    select: (data: InfiniteData<TData>) => data.pages.flatMap((page) => page) as unknown as TData,
    ...options,
  })
}

export function useApiMutation<TData, TVariables>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: UseMutationOptions<TData, AxiosError, TVariables>
) {

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await api[method]<TData>(url, variables)
      return response.data
    },
    ...options,
  })
}
