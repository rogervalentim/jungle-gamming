import { expect, test } from '@playwright/test'
import type { Locator, Page, Response } from '@playwright/test'

interface ListedNft {
  name: string
  price: string
  genre: string
  network: string
}

interface CatalogPayload {
  items: ListedNft[]
  total: number
}

const desktopCatalog = (page: Page) =>
  page
    .locator('.desktop-experience')
    .getByRole('region', { name: 'Catálogo de NFTs' })

const mobileCatalog = (page: Page) =>
  page.locator('.mobile-flow').getByRole('region', { name: 'Catálogo de NFTs' })

const catalogUrl = (response: Response) => new URL(response.url())

function waitForCatalog(
  page: Page,
  params: Record<string, string> = {},
): Promise<Response> {
  return page.waitForResponse((response) => {
    const url = catalogUrl(response)
    return (
      url.pathname === '/api/nfts' &&
      response.request().method() === 'GET' &&
      Object.entries(params).every(
        ([key, value]) => url.searchParams.get(key) === value,
      )
    )
  })
}

async function payloadFromWorker(response: Response): Promise<CatalogPayload> {
  expect(response.fromServiceWorker()).toBe(true)
  expect(response.status()).toBe(200)
  expect(catalogUrl(response).searchParams.get('pageSize')).toBe('8')
  return (await response.json()) as CatalogPayload
}

async function expectDesktopItems(catalog: Locator, items: ListedNft[]) {
  const cards = catalog.getByRole('button', { name: /^Visualizar / })
  await expect(cards).toHaveCount(items.length)
  for (const [index, item] of items.entries()) {
    await expect(cards.nth(index)).toHaveAccessibleName(
      `Visualizar ${item.name}`,
    )
  }
}

async function expectMobileItems(catalog: Locator, items: ListedNft[]) {
  const cards = catalog.locator('.m-product-view')
  await expect(cards).toHaveCount(items.length)
  for (const [index, item] of items.entries()) {
    await expect(cards.nth(index)).toContainText(item.name)
  }
}

function toWei(price: string) {
  const [whole, fraction = ''] = price.split('.')
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'))
}

test('busca e filtros cumulativos do desktop usam a URL e a resposta REST', async ({
  page,
}) => {
  const initial = waitForCatalog(page)
  await page.goto('/')
  expect((await payloadFromWorker(await initial)).total).toBeGreaterThanOrEqual(
    24,
  )

  const catalog = desktopCatalog(page)
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' })
  const searched = waitForCatalog(page, { search: 'Emerald' })
  await search.fill('Emerald')
  const searchResponse = await searched
  const searchPayload = await payloadFromWorker(searchResponse)
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'Emerald')
  await expectDesktopItems(catalog, searchPayload.items)
  expect(searchPayload.items.length).toBeGreaterThan(0)
  expect(
    searchPayload.items.every((item) =>
      item.name.toLowerCase().includes('emerald'),
    ),
  ).toBe(true)

  await search.fill('')
  await expect(page).toHaveURL((url) => !url.searchParams.get('q'))

  const genreResponse = waitForCatalog(page, { genre: 'fotografia' })
  await page.getByRole('button', { name: 'Fotografia', exact: true }).click()
  await payloadFromWorker(await genreResponse)
  const networkResponse = waitForCatalog(page, {
    genre: 'fotografia',
    network: 'polygon',
  })
  await page.getByRole('button', { name: 'Polygon', exact: true }).click()
  const networkPayload = await payloadFromWorker(await networkResponse)
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('genre') === 'fotografia' &&
      url.searchParams.get('network') === 'polygon' &&
      !url.searchParams.get('q'),
  )
  await expectDesktopItems(catalog, networkPayload.items)
  expect(networkPayload.items.length).toBeGreaterThan(0)
  expect(
    networkPayload.items.every(
      (item) => item.genre === 'fotografia' && item.network === 'polygon',
    ),
  ).toBe(true)

  const priced = waitForCatalog(page, {
    genre: 'fotografia',
    network: 'polygon',
    minPrice: '0.9',
    maxPrice: '1',
  })
  await page.goto('/?genre=fotografia&network=polygon&minPrice=0.9&maxPrice=1')
  const pricePayload = await payloadFromWorker(await priced)
  await expectDesktopItems(catalog, pricePayload.items)
  expect(pricePayload.items.length).toBeGreaterThan(0)
  expect(
    pricePayload.items.every(
      (item) =>
        toWei(item.price) >= toWei('0.9') && toWei(item.price) <= toWei('1'),
    ),
  ).toBe(true)
})

test('ordenação e paginação preservam estado em histórico e refresh', async ({
  page,
}) => {
  const firstPage = waitForCatalog(page, { sort: 'price-asc' })
  await page.goto('/?sort=price-asc')
  const first = await payloadFromWorker(await firstPage)
  const catalog = desktopCatalog(page)
  await expectDesktopItems(catalog, first.items)
  expect(first.total).toBeGreaterThanOrEqual(24)
  expect(first.items.length).toBe(8)
  expect(first.items.map((item) => toWei(item.price))).toEqual(
    [...first.items.map((item) => toWei(item.price))].sort((a, b) =>
      a < b ? -1 : a > b ? 1 : 0,
    ),
  )

  const secondPage = waitForCatalog(page, { sort: 'price-asc', page: '2' })
  await catalog.getByRole('button', { name: 'Página 2' }).click()
  const second = await payloadFromWorker(await secondPage)
  await expect(page).toHaveURL((url) => url.searchParams.get('page') === '2')
  await expectDesktopItems(catalog, second.items)
  expect(second.items.map((item) => item.name)).not.toEqual(
    first.items.map((item) => item.name),
  )

  const thirdPage = waitForCatalog(page, { sort: 'price-asc', page: '3' })
  await catalog.getByRole('button', { name: 'Próxima página' }).click()
  const third = await payloadFromWorker(await thirdPage)
  await expectDesktopItems(catalog, third.items)
  await expect(page).toHaveURL((url) => url.searchParams.get('page') === '3')

  await page.goBack()
  await expect(page).toHaveURL((url) => url.searchParams.get('page') === '2')
  await expectDesktopItems(catalog, second.items)
  await page.goForward()
  await expect(page).toHaveURL((url) => url.searchParams.get('page') === '3')
  await expectDesktopItems(catalog, third.items)
  await page.reload()
  await expectDesktopItems(catalog, third.items)

  const descending = waitForCatalog(page, { sort: 'price-desc' })
  await catalog
    .getByRole('combobox', { name: 'Ordenar por' })
    .selectOption('price-desc')
  const desc = await payloadFromWorker(await descending)
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('sort') === 'price-desc' &&
      (url.searchParams.get('page') === '1' || !url.searchParams.has('page')),
  )
  await expectDesktopItems(catalog, desc.items)
  expect(desc.items.map((item) => toWei(item.price))).toEqual(
    [...desc.items.map((item) => toWei(item.price))].sort((a, b) =>
      a > b ? -1 : a < b ? 1 : 0,
    ),
  )
})

test('busca, aba e filtro mobile restauram a seleção pela URL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const initial = waitForCatalog(page)
  await page.goto('/')
  await payloadFromWorker(await initial)
  const catalog = mobileCatalog(page)
  const searched = waitForCatalog(page, { search: 'Golden' })
  await page.getByRole('textbox', { name: 'Explorar coleções' }).fill('Golden')
  const searchPayload = await payloadFromWorker(await searched)
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'Golden')
  await expectMobileItems(catalog, searchPayload.items)

  const newReleases = waitForCatalog(page, {
    search: 'Golden',
    category: 'new',
  })
  await catalog.getByRole('button', { name: 'Novos lançamentos' }).click()
  const newPayload = await payloadFromWorker(await newReleases)
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('q') === 'Golden' &&
      url.searchParams.get('category') === 'new',
  )
  await expectMobileItems(catalog, newPayload.items)
  expect(newPayload.items.length).toBeGreaterThan(0)

  await page
    .locator('.mobile-flow')
    .getByRole('button', { name: 'Filtrar' })
    .click()
  const networkResponse = waitForCatalog(page, {
    search: 'Golden',
    category: 'new',
    network: 'solana',
  })
  await page
    .locator('.mobile-flow')
    .getByRole('combobox', { name: 'Rede' })
    .selectOption('solana')
  const filteredPayload = await payloadFromWorker(await networkResponse)
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('q') === 'Golden' &&
      url.searchParams.get('category') === 'new' &&
      url.searchParams.get('network') === 'solana',
  )
  await expectMobileItems(catalog, filteredPayload.items)
  expect(filteredPayload.items.length).toBeGreaterThan(0)
  expect(filteredPayload.items.every((item) => item.network === 'solana')).toBe(
    true,
  )

  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'Explorar coleções' }),
  ).toHaveValue('Golden')
  await expect(
    catalog.getByRole('button', { name: 'Novos lançamentos' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expectMobileItems(catalog, filteredPayload.items)
  await page.goBack()
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'Golden')
  await expectMobileItems(catalog, newPayload.items)
})

test('URL inválida produz filtros seguros na requisição e na interface', async ({
  page,
}) => {
  const normalized = waitForCatalog(page)
  await page.goto(
    '/?page=-3&sort=bogus&genre=invalid&network=invalid&minPrice=bad&maxPrice=-1',
  )
  const response = await normalized
  const payload = await payloadFromWorker(response)
  const requestParams = catalogUrl(response).searchParams
  expect(requestParams.get('page')).not.toBe('-3')
  expect(requestParams.get('sort')).not.toBe('bogus')
  expect(requestParams.get('genre')).not.toBe('invalid')
  expect(requestParams.get('network')).not.toBe('invalid')
  expect(requestParams.get('minPrice')).not.toBe('bad')
  expect(requestParams.get('maxPrice')).not.toBe('-1')
  await expectDesktopItems(desktopCatalog(page), payload.items)
  await expect(
    desktopCatalog(page).getByRole('combobox', { name: 'Ordenar por' }),
  ).toHaveValue('recent')
  await expect(
    page.getByRole('button', { name: 'Todas as coleções' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: 'Todas as redes' }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('busca rápida mantém o resultado da consulta mais recente', async ({
  page,
}) => {
  const initial = waitForCatalog(page)
  await page.goto('/')
  await payloadFromWorker(await initial)
  await page.evaluate(() =>
    window.kurioMocks!.configure({ scenario: 'success', latencyMs: 500 }),
  )
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' })
  const firstRequest = page.waitForRequest((request) => {
    const url = new URL(request.url())
    return (
      url.pathname === '/api/nfts' &&
      url.searchParams.get('search') === 'Emerald'
    )
  })
  await search.fill('Emerald')
  await firstRequest
  const latest = waitForCatalog(page, { search: 'Violet' })
  await search.fill('Violet')
  const latestPayload = await payloadFromWorker(await latest)
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'Violet')
  await expectDesktopItems(desktopCatalog(page), latestPayload.items)
  await expect(search).toHaveValue('Violet')
})
