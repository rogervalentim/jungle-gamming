import { http, HttpResponse } from 'msw'
import { changeDatabase } from './database'
import { respond, sessionFor } from './auth-handlers'

function denied() {
  return HttpResponse.json(
    { code: 'SESSION_INVALID', message: 'Entre para acessar seus favoritos.' },
    { status: 401 },
  )
}

export const favoriteHandlers = [
  http.get('/api/favorites', ({ request }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current) return denied()
      return HttpResponse.json({ ids: db.userData[current.user.id].favoriteIds })
    }),
  ),
  http.put('/api/favorites/:id', ({ request, params }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current) return denied()
      const id = String(params.id)
      if (!db.nfts.some((item) => item.id === id))
        return HttpResponse.json(
          { code: 'NOT_FOUND', message: 'NFT não encontrado.' },
          { status: 404 },
        )
      const next = changeDatabase((draft) => {
        const ids = draft.userData[current.user.id].favoriteIds
        if (!ids.includes(id)) ids.push(id)
      })
      return HttpResponse.json({ ids: next.userData[current.user.id].favoriteIds })
    }),
  ),
  http.delete('/api/favorites/:id', ({ request, params }) =>
    respond((db) => {
      const current = sessionFor(request, db)
      if (!current) return denied()
      const id = String(params.id)
      if (!db.nfts.some((item) => item.id === id))
        return HttpResponse.json(
          { code: 'NOT_FOUND', message: 'NFT não encontrado.' },
          { status: 404 },
        )
      const next = changeDatabase((draft) => {
        draft.userData[current.user.id].favoriteIds = draft.userData[
          current.user.id
        ].favoriteIds.filter((item) => item !== id)
      })
      return HttpResponse.json({ ids: next.userData[current.user.id].favoriteIds })
    }),
  ),
]
