import { delay, http, HttpResponse } from 'msw'
import { changeDatabase, getConfig, readDatabase } from './database'
import type { MockDatabase, MockUser } from './database'
import { mergeGuestCart } from './cart-handlers'

function failure(code: string, message: string, status: number) {
  return HttpResponse.json({ code, message }, { status })
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function publicUser(user: MockUser) {
  return { id: user.id, email: user.email, profile: user.profile }
}

export function sessionFor(request: Request, db: MockDatabase) {
  if (getConfig(db).scenario === 'expired') return null
  const authorization = request.headers.get('authorization') ?? ''
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1]
  const session = token ? db.sessions[token] : undefined
  if (!session || Date.parse(session.expiresAt) <= Date.now()) return null
  const user = db.users.find((item) => item.id === session.userId)
  return user ? { token: token!, session, user } : null
}

export async function passwordHash(
  password: string,
  salt: string,
  iterations: number,
) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(salt),
      iterations,
    },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

export async function respond(
  run: (db: MockDatabase) => Response | Promise<Response>,
) {
  try {
    const before = readDatabase()
    const { scenario, latencyMs } = getConfig(before)
    await delay(latencyMs ?? (scenario === 'slow' ? 2500 : 50))
    const db = readDatabase()
    if (db.resetToken !== before.resetToken)
      return failure('SCENARIO_RESET', 'O cenário foi reiniciado.', 409)
    if (scenario === 'error')
      return failure(
        'UNAVAILABLE',
        'Serviço de conta temporariamente indisponível.',
        503,
      )
    if (scenario === 'offline') return HttpResponse.error()
    return await run(db)
  } catch {
    return failure(
      'MOCK_STORAGE_ERROR',
      'Não foi possível acessar a conta.',
      503,
    )
  }
}

function createSession(userId: string) {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  changeDatabase((draft) => {
    draft.sessions[token] = { id: token, userId, expiresAt }
    mergeGuestCart(draft, userId)
  })
  return { token, expiresAt }
}

export const authHandlers = [
  http.get('/api/auth/session', ({ request }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current)
        return failure('SESSION_INVALID', 'Sessão inválida ou expirada.', 401)
      return HttpResponse.json({
        user: publicUser(current.user),
        expiresAt: current.session.expiresAt,
      })
    }),
  ),
  http.post('/api/auth/login', ({ request }) =>
    respond(async (db) => {
      const body: unknown = await request.json().catch(() => null)
      if (
        !record(body) ||
        typeof body.email !== 'string' ||
        typeof body.password !== 'string' ||
        !body.email.trim() ||
        !body.password
      )
        return failure('VALIDATION_ERROR', 'Informe e-mail e senha.', 422)
      const email = body.email.trim().toLowerCase()
      const user = db.users.find((item) => item.email === email)
      if (!user)
        return failure(
          'INVALID_CREDENTIALS',
          'E-mail ou senha incorretos.',
          401,
        )
      const hash = await passwordHash(
        body.password,
        user.credential.salt,
        user.credential.iterations,
      )
      if (hash !== user.credential.hash)
        return failure(
          'INVALID_CREDENTIALS',
          'E-mail ou senha incorretos.',
          401,
        )
      return HttpResponse.json({
        user: publicUser(user),
        ...createSession(user.id),
      })
    }),
  ),
  http.post('/api/auth/register', ({ request }) =>
    respond(async (db) => {
      const body: unknown = await request.json().catch(() => null)
      if (
        !record(body) ||
        typeof body.name !== 'string' ||
        typeof body.email !== 'string' ||
        typeof body.password !== 'string'
      )
        return failure('VALIDATION_ERROR', 'Dados de cadastro inválidos.', 422)
      const name = body.name.trim()
      const email = body.email.trim().toLowerCase()
      if (name.length < 2 || name.length > 80)
        return failure(
          'VALIDATION_ERROR',
          'O nome deve ter entre 2 e 80 caracteres.',
          422,
        )
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return failure('VALIDATION_ERROR', 'Informe um e-mail válido.', 422)
      if (body.password.length < 8 || body.password.length > 128)
        return failure(
          'VALIDATION_ERROR',
          'A senha deve ter entre 8 e 128 caracteres.',
          422,
        )
      if (db.users.some((user) => user.email.toLowerCase() === email))
        return failure('EMAIL_CONFLICT', 'Este e-mail já está cadastrado.', 409)
      const salt = crypto.randomUUID()
      const hash = await passwordHash(body.password, salt, 210000)
      if (
        readDatabase().users.some((user) => user.email.toLowerCase() === email)
      )
        return failure('EMAIL_CONFLICT', 'Este e-mail já está cadastrado.', 409)
      const user: MockUser = {
        id: `collector-${crypto.randomUUID()}`,
        email,
        profile: { name, avatar: null },
        credential: {
          algorithm: 'PBKDF2-SHA256',
          iterations: 210000,
          salt,
          hash,
        },
      }
      changeDatabase((draft) => {
        draft.users.push(user)
        draft.userData[user.id] = {
          favoriteIds: [],
          cartItems: [],
          walletIds: [],
          orderIds: [],
        }
      })
      return HttpResponse.json(
        { user: publicUser(user), ...createSession(user.id) },
        { status: 201 },
      )
    }),
  ),
  http.post('/api/auth/logout', ({ request }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current)
        return failure('SESSION_INVALID', 'Sessão inválida ou expirada.', 401)
      changeDatabase((draft) => {
        delete draft.sessions[current.token]
      })
      return new HttpResponse(null, { status: 204 })
    }),
  ),
]
