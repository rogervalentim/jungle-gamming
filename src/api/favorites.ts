import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './nfts'
import { useSession } from './auth'

interface FavoriteResponse {
  ids: string[]
}

function loginForCurrentPage() {
  window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
}

export function useFavorites() {
  const { user } = useSession()
  return useQuery({
    queryKey: ['favorites', user?.id],
    enabled: Boolean(user),
    queryFn: async ({ signal }) =>
      (await api.get<FavoriteResponse>('/favorites', { signal })).data,
  })
}

export function useFavorite(id: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const key = ['favorites', user?.id]
  const favorites = useFavorites()
  const active = Boolean(favorites.data?.ids.includes(id))
  const mutation = useMutation({
    mutationFn: async (next: boolean) => {
      const url = `/favorites/${encodeURIComponent(id)}`
      return (
        next
          ? await api.put<FavoriteResponse>(url)
          : await api.delete<FavoriteResponse>(url)
      ).data
    },
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<FavoriteResponse>(key)
      queryClient.setQueryData<FavoriteResponse>(key, {
        ids: next
          ? [...new Set([...(previous?.ids ?? []), id])]
          : (previous?.ids ?? []).filter((item) => item !== id),
      })
      return previous
    },
    onError: (_error, _next, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
      else queryClient.removeQueries({ queryKey: key, exact: true })
    },
    onSuccess: (response) => queryClient.setQueryData(key, response),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: key }),
  })

  return {
    active,
    loading: Boolean(user) && favorites.isPending,
    pending: mutation.isPending,
    error: mutation.error ?? favorites.error,
    toggle: () => {
      if (!user) return loginForCurrentPage()
      if (mutation.isPending || favorites.isPending) return
      mutation.mutate(!active)
    },
  }
}
