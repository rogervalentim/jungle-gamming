import { expect, test } from '@playwright/test'

test('carrinho de visitante migra para a conta e pedido confirmado pode ser recuperado', async ({ page }) => {
  const ready = page.waitForResponse((response) => response.url().includes('/api/nfts?') && response.fromServiceWorker())
  await page.goto('/')
  await ready
  const result = await page.evaluate(async () => {
    const json = async (url: string, init?: RequestInit) => {
      const response = await fetch(url, init)
      return { status: response.status, body: await response.json() }
    }
    const nfts = await json('/api/nfts')
    const nft = nfts.body.items[0]
    const edition = nft.editions[0]
    const item = { nftId: nft.id, editionId: edition.id, quantity: 1 }
    const guest = await json('/api/cart/items', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item),
    })
    const email = `buyer-${crypto.randomUUID()}@example.test`
    const registration = await json('/api/auth/register', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Comprador Teste', email, password: 'SenhaTeste123' }),
    })
    const token = registration.body.token
    localStorage.setItem('kurio-auth-token', token)
    const headers = { 'content-type': 'application/json', authorization: `Bearer ${token}` }
    const cart = await json('/api/cart', { headers })
    const wallet = await json('/api/wallets', {
      method: 'POST', headers,
      body: JSON.stringify({ label: 'Principal', address: '0x1234567890abcdef', network: 'ethereum', primary: true }),
    })
    const quote = await json('/api/checkout/quote?coupon=KURIO10', { headers })
    const input = {
      walletId: wallet.body.id, provider: 'MetaMask',
      quoteId: quote.body.quoteId, idempotencyKey: crypto.randomUUID(),
    }
    const order = await json('/api/orders?coupon=KURIO10', {
      method: 'POST', headers, body: JSON.stringify(input),
    })
    const duplicate = await json('/api/orders?coupon=KURIO10', {
      method: 'POST', headers, body: JSON.stringify(input),
    })
    const restored = await json(`/api/orders/${order.body.id}`, { headers })
    const cartAfter = await json('/api/cart', { headers })
    const profile = await json('/api/profile', { headers })
    return {
      guestStatus: guest.status, registerStatus: registration.status,
      cartBefore: cart.body.items.length, walletStatus: wallet.status,
      quoteStatus: quote.status, discount: quote.body.discount,
      orderStatus: order.status, orderId: order.body.id, orderState: order.body.status,
      duplicateStatus: duplicate.status, duplicateId: duplicate.body.id,
      restoredStatus: restored.status, restoredId: restored.body.id,
      cartAfter: cartAfter.body.items.length, profileStatus: profile.status,
    }
  })
  expect(result).toMatchObject({
    guestStatus: 200, registerStatus: 201, cartBefore: 1, walletStatus: 201,
    quoteStatus: 200, orderStatus: 201, orderState: 'confirmed',
    duplicateStatus: 200, restoredStatus: 200, cartAfter: 0, profileStatus: 200,
  })
  expect(result.discount).not.toBe('0')
  expect(result.duplicateId).toBe(result.orderId)
  expect(result.restoredId).toBe(result.orderId)
  await page.goto(`/pagamento?order=${result.orderId}`)
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible()
  await expect(page.getByText(`Pedido #${result.orderId.slice(0, 8)}`, { exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/perfil-do-colecionador')
  await page.locator('#profile-name').fill('Comprador Atualizado')
  await page.locator('#profile-username').fill('colecionador')
  await page.locator('#profile-ens').fill('colecionador.eth')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('status')).toContainText('Perfil salvo com sucesso.')
  await page.reload()
  await expect(page.locator('#profile-name')).toHaveValue('Comprador Atualizado')
  await page.goto('/carteiras')
  await expect(page.getByRole('textbox', { name: /Apelido da carteira/ }).first()).toHaveValue('Principal')
})
