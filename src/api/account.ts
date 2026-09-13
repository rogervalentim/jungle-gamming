import { useQuery } from '@tanstack/react-query'
import { api, queryClient } from './nfts'
import { useAuthToken } from '#/lib/auth-token'

export interface Profile {
  email: string
  name: string
  username?: string
  bio?: string
  ens?: string
  avatar: string | null
}

export interface Wallet {
  id: string
  label: string
  address: string
  network: 'ethereum' | 'polygon' | 'solana'
  primary: boolean
}

export type WalletInput = Omit<Wallet, 'id'>

export function useProfile() {
  const token = useAuthToken()
  return useQuery({
    queryKey: ['profile', token],
    enabled: Boolean(token),
    queryFn: async ({ signal }) =>
      (await api.get<Profile>('/profile', { signal })).data,
  })
}

export async function saveProfile(update: Pick<Profile, 'name' | 'username' | 'bio' | 'ens' | 'avatar'>) {
  const response = await api.patch<Profile>('/profile', update)
  await queryClient.invalidateQueries({ queryKey: ['profile'] })
  await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
  return response.data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await api.post('/profile/password', { currentPassword, newPassword })
}

export function useWallets() {
  const token = useAuthToken()
  return useQuery({
    queryKey: ['wallets', token],
    enabled: Boolean(token),
    queryFn: async ({ signal }) =>
      (await api.get<{ items: Wallet[] }>('/wallets', { signal })).data,
  })
}

export async function saveWallet(input: WalletInput, id?: string) {
  const response = id
    ? await api.put<Wallet>(`/wallets/${encodeURIComponent(id)}`, input)
    : await api.post<Wallet>('/wallets', input)
  await queryClient.invalidateQueries({ queryKey: ['wallets'] })
  return response.data
}

export async function deleteWallet(id: string) {
  await api.delete(`/wallets/${encodeURIComponent(id)}`)
  await queryClient.invalidateQueries({ queryKey: ['wallets'] })
}
