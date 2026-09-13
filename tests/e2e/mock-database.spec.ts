import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import type { MockDatabase } from '../../src/mocks/database'
import type { NftListResponse } from '../../src/api/nfts'

const databaseKey = 'kurio-mock-db-v1'

function catalog(page: Page) {
  return page.getByRole('region', { name: 'Catálogo de NFTs' })
}

async function readDatabase(page: Page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!) as MockDatabase,
    databaseKey,
  )
}

async function openCatalog(page: Page) {
  const initialResponse = page.waitForResponse((response) =>
    response.url().includes('/api/nfts?'),
  )
  await page.goto('/')
  const response = await initialResponse
  expect(response.status()).toBe(200)
  expect(response.fromServiceWorker()).toBe(true)
  await expect(
    catalog(page).getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
}

test('persiste preço ETH exato e estoque alterados pela API simulada após refresh', async ({
  page,
}) => {
  await openCatalog(page)
  const price = '2.123456789123456789'
  const mutationPromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/__mock/nfts/emerald-042') &&
      response.request().method() === 'PATCH',
  )
  const listPromise = page.waitForResponse((response) =>
    response.url().includes('/api/nfts?'),
  )

  const updated = await page.evaluate(
    (amount) =>
      window.kurioMocks!.updateNft('emerald-042', {
        price: amount,
        availableQuantity: 3,
      }),
    price,
  )
  const mutation = await mutationPromise
  expect(mutation.fromServiceWorker()).toBe(true)
  expect(mutation.status()).toBe(200)
  expect(updated).toMatchObject({ price, availableQuantity: 3 })

  const listResponse = await listPromise
  expect(listResponse.fromServiceWorker()).toBe(true)
  const payload: NftListResponse = await listResponse.json()
  const updatedNft = payload.items.find((item) => item.id === 'emerald-042')
  expect(updatedNft).toMatchObject({ price, availableQuantity: 3 })
  expect(updatedNft?.editions[0]).toMatchObject({
    id: 'emerald-042-edition-1',
    price,
    availableQuantity: 3,
  })
  await expect(
    catalog(page).getByText(`${price} ETH`, { exact: true }),
  ).toBeVisible()

  const reloadedListPromise = page.waitForResponse((response) =>
    response.url().includes('/api/nfts?'),
  )
  await page.reload()
  const reloadedResponse = await reloadedListPromise
  expect(reloadedResponse.fromServiceWorker()).toBe(true)
  const reloadedPayload: NftListResponse = await reloadedResponse.json()
  expect(
    reloadedPayload.items.find((item) => item.id === 'emerald-042'),
  ).toMatchObject({ price, availableQuantity: 3 })
  await expect(
    catalog(page).getByText(`${price} ETH`, { exact: true }),
  ).toBeVisible()
  expect(
    (await readDatabase(page)).nfts.find((item) => item.id === 'emerald-042')!
      .editions[0],
  ).toMatchObject({ price, availableQuantity: 3 })
})

test('mantém cenário vazio e latência configurada depois de recarregar', async ({
  page,
}) => {
  await openCatalog(page)
  const configPromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/__mock/config') &&
      response.request().method() === 'PATCH',
  )
  await page.evaluate(() =>
    window.kurioMocks!.configure({ scenario: 'empty', latencyMs: 650 }),
  )
  expect((await configPromise).fromServiceWorker()).toBe(true)
  await expect(catalog(page).getByText('Nenhum NFT encontrado.')).toBeVisible()

  await page.reload()
  await expect(
    catalog(page).getByRole('status', { name: 'Carregando NFTs' }),
  ).toBeVisible()
  await expect(catalog(page).getByText('Nenhum NFT encontrado.')).toBeVisible()
  await expect(
    catalog(page).getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(0)
  expect(await page.evaluate(() => window.kurioMocks!.state())).toMatchObject({
    config: { scenario: 'empty', latencyMs: 650 },
  })
  expect((await readDatabase(page)).config).toEqual({
    scenario: 'empty',
    latencyMs: 650,
  })
})

test('reset restaura fixtures e limpa dados legados sem apagar armazenamento alheio', async ({
  page,
}) => {
  await openCatalog(page)
  const initial = await readDatabase(page)
  await page.evaluate(async () => {
    await window.kurioMocks!.updateNft('emerald-042', {
      price: '8.765432109876543210',
      availableQuantity: 0,
    })
    await window.kurioMocks!.configure({ scenario: 'empty', latencyMs: 10 })
    localStorage.setItem('kurio-cart', '["Emerald Ape #042"]')
    localStorage.setItem(
      'kurio-cart-v2',
      '[{"name":"Emerald Ape #042","quantity":2}]',
    )
    localStorage.setItem('kurio-favorites', '["Emerald Ape #042"]')
    localStorage.setItem('kurio-mock-scenario', 'error')
    localStorage.setItem('unrelated-app-preference', 'keep-me')
  })
  await expect(catalog(page).getByText('Nenhum NFT encontrado.')).toBeVisible()

  const resetResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/__mock/reset') &&
      response.request().method() === 'POST',
  )
  await Promise.all([
    page.waitForEvent('load'),
    page.evaluate(() => window.kurioMocks!.reset()),
  ])
  const resetResponse = await resetResponsePromise
  expect(resetResponse.fromServiceWorker()).toBe(true)
  expect(resetResponse.status()).toBe(200)
  await expect(page).toHaveURL((url) => url.pathname === '/')
  await expect(
    catalog(page).getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  await expect(
    catalog(page).getByText('1.19 ETH', { exact: true }),
  ).toBeVisible()

  const restored = await readDatabase(page)
  expect(restored.resetToken).not.toBe(initial.resetToken)
  expect({ ...restored, resetToken: initial.resetToken }).toEqual(initial)
  expect(
    await page.evaluate(() => ({
      cart: localStorage.getItem('kurio-cart'),
      cartV2: localStorage.getItem('kurio-cart-v2'),
      favorites: localStorage.getItem('kurio-favorites'),
      scenario: localStorage.getItem('kurio-mock-scenario'),
      unrelated: localStorage.getItem('unrelated-app-preference'),
    })),
  ).toEqual({
    cart: null,
    cartV2: null,
    favorites: null,
    scenario: null,
    unrelated: 'keep-me',
  })
})

test('seed tem dois usuários separados e se recupera de JSON corrompido ou versão incompatível', async ({
  page,
}) => {
  await openCatalog(page)
  const seed = await readDatabase(page)
  expect(seed.users).toHaveLength(2)
  expect(new Set(seed.users.map((user) => user.id)).size).toBe(2)
  expect(new Set(seed.users.map((user) => user.email)).size).toBe(2)
  expect(new Set(seed.users.map((user) => user.credential.salt)).size).toBe(2)
  expect(new Set(seed.users.map((user) => user.credential.hash)).size).toBe(2)
  for (const user of seed.users) {
    expect(user.credential).toMatchObject({
      algorithm: 'PBKDF2-SHA256',
      iterations: 210000,
      hash: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
    expect(seed.userData[user.id]).toEqual({
      favoriteIds: [],
      cartItems: [],
      walletIds: [],
      orderIds: [],
    })
  }
  expect(JSON.stringify(seed)).not.toContain('KurioAna!2026')
  expect(JSON.stringify(seed)).not.toContain('KurioBruno!2026')
  const state = await page.evaluate(() => window.kurioMocks!.state())
  expect(JSON.stringify(state)).not.toContain('credential')
  expect(JSON.stringify(state)).not.toContain(seed.users[0].credential.hash)

  for (const invalid of [
    '{broken-json',
    JSON.stringify({ ...seed, schemaVersion: 999 }),
  ]) {
    await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
      key: databaseKey,
      value: invalid,
    })
    await page.reload()
    await expect(
      catalog(page).getByRole('button', { name: /^Visualizar / }),
    ).toHaveCount(8)
    await expect(
      catalog(page).getByText('1.19 ETH', { exact: true }),
    ).toBeVisible()
    const restored = await readDatabase(page)
    expect(restored.resetToken).not.toBe(seed.resetToken)
    expect({ ...restored, resetToken: seed.resetToken }).toEqual(seed)
  }
})

test('rejeita resposta de catálogo iniciada antes do reset da base', async ({
  page,
}) => {
  await openCatalog(page)
  await page.evaluate(() => window.kurioMocks!.configure({ latencyMs: 2000 }))
  const pendingUrl =
    '/api/nfts?minPrice=0&maxPrice=12.3&category=all&resetRace=1'
  const requestPromise = page.waitForRequest((request) =>
    request.url().endsWith(pendingUrl),
  )
  const responsePromise = page.waitForResponse((response) =>
    response.url().endsWith(pendingUrl),
  )
  const pendingFetch = page.evaluate(async (url) => {
    const response = await fetch(url)
    return { status: response.status, body: await response.json() }
  }, pendingUrl)
  await requestPromise

  // The administration request completes while the earlier catalog request
  // remains delayed. Reset through REST here to keep that request alive.
  const resetStatus = await page.evaluate(async () => {
    await window.kurioMocks!.state()
    const response = await fetch('/api/__mock/reset', { method: 'POST' })
    return response.status
  })
  expect(resetStatus).toBe(200)
  const response = await responsePromise
  expect(response.fromServiceWorker()).toBe(true)
  expect(await pendingFetch).toMatchObject({
    status: 409,
    body: { code: 'SCENARIO_RESET' },
  })

  await page.reload()
  await expect(
    catalog(page).getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  expect((await readDatabase(page)).config).toEqual({
    scenario: 'success',
    latencyMs: null,
  })
})
