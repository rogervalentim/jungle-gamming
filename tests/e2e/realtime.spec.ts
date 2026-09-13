import { expect, test } from '@playwright/test'

test('cliente Socket.IO conecta ao transporte simulado', async ({ page }) => {
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => window.kurioRealtime?.connected())).toBe(true)
  await page.evaluate(() => window.kurioMocks!.updateNft('emerald-042', { price: '2.5' }))
  await expect.poll(() => page.evaluate(() => window.kurioRealtime?.nftVersion('emerald-042'))).toBeGreaterThan(0)
  const firstVersion = await page.evaluate(() => window.kurioRealtime!.nftVersion('emerald-042'))
  const secondTab = await page.context().newPage()
  await secondTab.goto('/')
  await expect.poll(() => secondTab.evaluate(() => Boolean(window.kurioMocks))).toBe(true)
  await secondTab.evaluate(() => window.kurioMocks!.updateNft('emerald-042', { price: '3.5' }))
  await expect.poll(() => page.evaluate(() => window.kurioRealtime?.nftVersion('emerald-042'))).toBeGreaterThan(firstVersion)
  await secondTab.close()
})

test('pedido pendente é resolvido por evento e recuperado após refresh', async ({ page }) => {
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => window.kurioRealtime?.connected())).toBe(true)
  const walletId = await page.evaluate(async () => {
    const json = async (url: string, init?: RequestInit) => {
      const response = await fetch(url, init)
      return response.json()
    }
    const email = `pending-${crypto.randomUUID()}@example.test`
    const account = await json('/api/auth/register', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Comprador', email, password: 'SenhaTeste123' }),
    })
    localStorage.setItem('kurio-auth-token', account.token)
    const headers = { 'content-type': 'application/json', authorization: `Bearer ${account.token}` }
    const catalog = await json('/api/nfts')
    const nft = catalog.items[0]
    await json('/api/cart/items', { method: 'POST', headers,
      body: JSON.stringify({ nftId: nft.id, editionId: nft.editions[0].id, quantity: 1 }) })
    const wallet = await json('/api/wallets', { method: 'POST', headers,
      body: JSON.stringify({ label: 'Principal', address: '0x1234567890abcdef', network: 'ethereum', primary: true }) })
    return wallet.id as string
  })
  await page.reload()
  await expect.poll(() => page.evaluate(() => window.kurioRealtime?.connected())).toBe(true)
  const orderId = await page.evaluate(async (savedWalletId) => {
    const headers = { 'content-type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('kurio-auth-token')}` }
    const quoteResponse = await fetch('/api/checkout/quote', { headers })
    const quote = await quoteResponse.json()
    await window.kurioMocks!.configure({ scenario: 'pending', latencyMs: 0 })
    const orderResponse = await fetch('/api/orders', { method: 'POST', headers,
      body: JSON.stringify({ walletId: savedWalletId, provider: 'MetaMask', quoteId: quote.quoteId,
        idempotencyKey: crypto.randomUUID() }) })
    const order = await orderResponse.json()
    if (order.status !== 'pending') throw new Error('Pedido não iniciou pendente')
    return order.id as string
  }, walletId)
  await expect.poll(() => page.evaluate((id) => window.kurioRealtime?.orderVersion(id), orderId)).toBeGreaterThan(0)
  await page.goto(`/pagamento?order=${orderId}`)
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible({ timeout: 10_000 })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible()
  const timeout = await page.evaluate(async () => {
    const headers = { 'content-type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('kurio-auth-token')}` }
    const catalog = await (await fetch('/api/nfts')).json()
    const nft = catalog.items[1]
    await fetch('/api/cart/items', { method: 'POST', headers,
      body: JSON.stringify({ nftId: nft.id, editionId: nft.editions[0].id, quantity: 1 }) })
    const quote = await (await fetch('/api/checkout/quote', { headers })).json()
    const wallets = await (await fetch('/api/wallets', { headers })).json()
    await window.kurioMocks!.configure({ scenario: 'timeout', latencyMs: 0 })
    const idempotencyKey = crypto.randomUUID()
    const input = { walletId: wallets.items[0].id, provider: 'MetaMask',
      quoteId: quote.quoteId, idempotencyKey }
    let responseFailed = false
    try {
      await fetch('/api/orders', { method: 'POST', headers, body: JSON.stringify(input) })
    } catch { responseFailed = true }
    const orders = await (await fetch('/api/orders', { headers })).json()
    const recovered = orders.items.find((item: { idempotencyKey: string }) => item.idempotencyKey === idempotencyKey)
    const duplicate = await (await fetch('/api/orders', { method: 'POST', headers,
      body: JSON.stringify(input) })).json()
    return { responseFailed, recoveredId: recovered?.id, duplicateId: duplicate.id }
  })
  expect(timeout.responseFailed).toBe(true)
  expect(timeout.recoveredId).toBeTruthy()
  expect(timeout.duplicateId).toBe(timeout.recoveredId)
})

test('checkout recupera timeout sem criar dois pedidos', async ({ page }) => {
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => Boolean(window.kurioMocks))).toBe(true)
  await page.evaluate(async () => {
    const headers = { 'content-type': 'application/json' }
    const email = `timeout-${crypto.randomUUID()}@example.test`
    const account = await (await fetch('/api/auth/register', { method: 'POST', headers,
      body: JSON.stringify({ name: 'Comprador', email, password: 'SenhaTeste123' }) })).json()
    localStorage.setItem('kurio-auth-token', account.token)
    const catalog = await (await fetch('/api/nfts')).json()
    const nft = catalog.items[0]
    const authHeaders = { ...headers, authorization: `Bearer ${account.token}` }
    await fetch('/api/cart/items', { method: 'POST', headers: authHeaders,
      body: JSON.stringify({ nftId: nft.id, editionId: nft.editions[0].id, quantity: 1 }) })
    await fetch('/api/wallets', { method: 'POST', headers: authHeaders,
      body: JSON.stringify({ label: 'Principal', address: '0x1234567890abcdef',
        network: 'ethereum', primary: true }) })
    await window.kurioMocks!.configure({ scenario: 'timeout', latencyMs: 0 })
  })
  await page.goto('/pagamento')
  await page.getByRole('radio', { name: 'MetaMask' }).check()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible({ timeout: 10_000 })
  const orderId = new URL(page.url()).searchParams.get('order')
  expect(orderId).toBeTruthy()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible()
  const orders = await page.evaluate(async () => {
    const token = localStorage.getItem('kurio-auth-token')
    const response = await fetch('/api/orders', { headers: { authorization: `Bearer ${token}` } })
    return (await response.json()).items.length as number
  })
  expect(orders).toBe(1)
})
