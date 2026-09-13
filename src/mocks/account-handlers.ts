import { http, HttpResponse } from 'msw'
import { changeDatabase } from './database'
import { passwordHash, respond, sessionFor } from './auth-handlers'
import type { MockWallet } from './database'

const fail = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status })

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validWallet(value: unknown): value is Omit<MockWallet, 'id'> {
  return (
    object(value) &&
    typeof value.label === 'string' &&
    value.label.trim().length >= 2 &&
    value.label.trim().length <= 60 &&
    typeof value.address === 'string' &&
    /^[^\s]{6,100}$/.test(value.address.trim()) &&
    typeof value.network === 'string' &&
    ['ethereum', 'polygon', 'solana'].includes(value.network) &&
    typeof value.primary === 'boolean'
  )
}

export const accountHandlers = [
  http.get('/api/profile', ({ request }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      return current
        ? HttpResponse.json({
            email: current.user.email,
            ...current.user.profile,
          })
        : fail('SESSION_INVALID', 'Entre para ver seu perfil.', 401)
    }),
  ),
  http.patch('/api/profile', ({ request }) =>
    respond(async (db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para editar seu perfil.', 401)
      const body: unknown = await request.json().catch(() => null)
      if (
        !object(body) ||
        typeof body.name !== 'string' ||
        body.name.trim().length < 2 ||
        body.name.trim().length > 80 ||
        (body.username !== undefined &&
          (typeof body.username !== 'string' || body.username.length > 40)) ||
        (body.bio !== undefined &&
          (typeof body.bio !== 'string' || body.bio.length > 500)) ||
        (body.ens !== undefined &&
          (typeof body.ens !== 'string' || body.ens.length > 80)) ||
        (body.avatar !== undefined &&
          body.avatar !== null &&
          (typeof body.avatar !== 'string' ||
            !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(
              body.avatar,
            ) ||
            body.avatar.length > 250_000))
      )
        return fail('VALIDATION_ERROR', 'Revise os dados do perfil.', 422)
      const name = body.name.trim()
      const username = String(body.username ?? '').trim()
      const bio = String(body.bio ?? '').trim()
      const ens = String(body.ens ?? '').trim()
      const avatar = 'avatar' in body ? (body.avatar as string | null) : undefined
      const next = changeDatabase((draft) => {
        const user = draft.users.find((item) => item.id === current.user.id)!
        user.profile.name = name
        user.profile.username = username
        user.profile.bio = bio
        user.profile.ens = ens
        if (avatar !== undefined) user.profile.avatar = avatar
      })
      const user = next.users.find((item) => item.id === current.user.id)!
      return HttpResponse.json({ email: user.email, ...user.profile })
    }),
  ),
  http.post('/api/profile/password', ({ request }) =>
    respond(async (db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para alterar a senha.', 401)
      const body: unknown = await request.json().catch(() => null)
      if (
        !object(body) ||
        typeof body.currentPassword !== 'string' ||
        typeof body.newPassword !== 'string' ||
        body.newPassword.length < 8 ||
        body.newPassword.length > 128
      )
        return fail('VALIDATION_ERROR', 'Informe a senha atual e uma nova senha válida.', 422)
      const oldHash = await passwordHash(
        body.currentPassword,
        current.user.credential.salt,
        current.user.credential.iterations,
      )
      if (oldHash !== current.user.credential.hash)
        return fail('INVALID_CREDENTIALS', 'Senha atual incorreta.', 401)
      const salt = crypto.randomUUID()
      const hash = await passwordHash(body.newPassword, salt, 210000)
      changeDatabase((draft) => {
        const user = draft.users.find((item) => item.id === current.user.id)!
        user.credential.salt = salt
        user.credential.hash = hash
        for (const [token, session] of Object.entries(draft.sessions))
          if (session.userId === user.id) delete draft.sessions[token]
      })
      return HttpResponse.json({ changed: true })
    }),
  ),
  http.get('/api/wallets', ({ request }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para ver carteiras.', 401)
      return HttpResponse.json({
        items: db.userData[current.user.id].walletIds.map((id) => db.wallets[id]),
      })
    }),
  ),
  http.post('/api/wallets', ({ request }) =>
    respond(async (db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para salvar carteiras.', 401)
      const body: unknown = await request.json().catch(() => null)
      if (!validWallet(body))
        return fail('VALIDATION_ERROR', 'Revise os dados da carteira.', 422)
      const duplicate = db.userData[current.user.id].walletIds.some(
        (id) =>
          db.wallets[id].network === body.network &&
          db.wallets[id].address.toLowerCase() === body.address.toLowerCase(),
      )
      if (duplicate) return fail('CONFLICT', 'Esta carteira já foi cadastrada.', 409)
      const wallet = {
        id: crypto.randomUUID(),
        userId: current.user.id,
        label: body.label.trim(),
        address: body.address.trim(),
        network: body.network,
        primary: body.primary,
      }
      changeDatabase((draft) => {
        if (wallet.primary)
          for (const id of draft.userData[current.user.id].walletIds)
            draft.wallets[id].primary = false
        draft.wallets[wallet.id] = wallet
        draft.userData[current.user.id].walletIds.push(wallet.id)
      })
      return HttpResponse.json(wallet, { status: 201 })
    }),
  ),
  http.put('/api/wallets/:id', ({ request, params }) =>
    respond(async (db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para salvar carteiras.', 401)
      const id = String(params.id)
      const existing = db.wallets[id]
      if (!(id in db.wallets)) return fail('NOT_FOUND', 'Carteira não encontrada.', 404)
      if (existing.userId !== current.user.id)
        return fail('FORBIDDEN', 'Carteira de outra conta.', 403)
      const body: unknown = await request.json().catch(() => null)
      if (!validWallet(body))
        return fail('VALIDATION_ERROR', 'Revise os dados da carteira.', 422)
      const next = changeDatabase((draft) => {
        if (body.primary)
          for (const walletId of draft.userData[current.user.id].walletIds)
            draft.wallets[walletId].primary = false
        draft.wallets[id] = {
          id,
          userId: current.user.id,
          label: body.label.trim(),
          address: body.address.trim(),
          network: body.network,
          primary: body.primary,
        }
      })
      return HttpResponse.json(next.wallets[id])
    }),
  ),
  http.delete('/api/wallets/:id', ({ request, params }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current) return fail('SESSION_INVALID', 'Entre para remover carteiras.', 401)
      const id = String(params.id)
      const existing = db.wallets[id]
      if (!(id in db.wallets)) return fail('NOT_FOUND', 'Carteira não encontrada.', 404)
      if (existing.userId !== current.user.id)
        return fail('FORBIDDEN', 'Carteira de outra conta.', 403)
      changeDatabase((draft) => {
        delete draft.wallets[id]
        draft.userData[current.user.id].walletIds = draft.userData[
          current.user.id
        ].walletIds.filter((walletId) => walletId !== id)
      })
      return HttpResponse.json({ removed: true })
    }),
  ),
]
