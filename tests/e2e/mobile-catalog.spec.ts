import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

const mobile = (page: Page) => page.locator('.mobile-flow')
const catalog = (page: Page) =>
  mobile(page).getByRole('region', { name: 'Catálogo de NFTs' })
const cards = (page: Page) => catalog(page).locator('.m-product-view')

test('vitrine mobile usa o MSW e recebe categorias ordenadas da mesma API', async ({
  page,
}) => {
  const firstResponse = page.waitForResponse((response) =>
    response.url().includes('/api/nfts?'),
  )
  await page.goto('/')
  const initialResponse = await firstResponse
  expect(initialResponse.fromServiceWorker()).toBe(true)
  expect((await initialResponse.json()).items).toHaveLength(8)
  await expect(cards(page)).toHaveCount(8)
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }))
  expect(width.content).toBeLessThanOrEqual(width.viewport)
  const newResponse = page.waitForResponse((response) =>
    response.url().includes('category=new'),
  )
  await catalog(page).getByRole('button', { name: 'Novos lançamentos' }).click()
  expect((await newResponse).fromServiceWorker()).toBe(true)
  await expect(cards(page)).toHaveCount(5)
  await expect(cards(page).first()).toContainText('Golden Beat #207')
  const trendingResponse = page.waitForResponse((response) =>
    response.url().includes('category=trending'),
  )
  await catalog(page).getByRole('button', { name: 'Em alta' }).click()
  expect((await trendingResponse).fromServiceWorker()).toBe(true)
  await expect(cards(page).first()).toContainText('Ivory Baron #088')
  await mobile(page)
    .getByRole('textbox', { name: 'Explorar coleções' })
    .fill('Cosmic')
  await expect(cards(page)).toHaveCount(1)
  await expect(cards(page).first()).toContainText('Cosmic Bloom #118')
})

test('mostra skeleton, estado vazio, falha e nova tentativa no celular', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() =>
    localStorage.setItem('kurio-mock-scenario', 'slow'),
  )
  await page.goto('/')
  await expect(
    catalog(page).getByRole('status', { name: 'Carregando NFTs' }),
  ).toBeVisible()
  await expect(
    catalog(page).locator('.m-product-skeleton .catalog-skeleton').first(),
  ).toHaveCSS('animation-name', 'none')
  await expect(cards(page)).toHaveCount(8)

  await page.evaluate(() => localStorage.removeItem('kurio-mock-scenario'))
  await page.evaluate(() =>
    window.kurioMocks!.configure({ scenario: 'empty', latencyMs: 0 }),
  )
  await expect(catalog(page).getByRole('status')).toHaveText(
    'Nenhum NFT encontrado.',
  )
  await expect(cards(page)).toHaveCount(0)

  await page.evaluate(() =>
    window.kurioMocks!.configure({ scenario: 'error', latencyMs: 0 }),
  )
  await expect(catalog(page).getByRole('alert')).toContainText(
    'Não foi possível carregar os NFTs.',
  )
  await page.evaluate(async () => {
    await fetch('/api/__mock/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: 'success' }),
    })
  })
  await catalog(page).getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(cards(page)).toHaveCount(8)
  await expect(catalog(page).getByRole('alert')).toHaveCount(0)
})

test('preço alterado via REST aparece no celular e sobrevive a refresh', async ({
  page,
}) => {
  await page.goto('/')
  await expect(cards(page)).toHaveCount(8)
  const price = '2.123456789123456789'
  const updated = await page.evaluate(
    (value) =>
      window.kurioMocks!.updateNft('emerald-042', {
        price: value,
        availableQuantity: 3,
      }),
    price,
  )
  expect(updated).toMatchObject({ price, availableQuantity: 3 })
  await expect(cards(page).first()).toContainText(`${price} ETH`)
  await page.reload()
  await expect(cards(page).first()).toContainText(`${price} ETH`)
})

test('abre qualquer NFT por rota, preserva o acesso direto e volta pelo histórico', async ({
  page,
}) => {
  await page.goto('/')
  await expect(cards(page)).toHaveCount(8)
  await cards(page).last().click()
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === '/mercado' &&
      url.searchParams.get('item') === 'signal-160',
  )
  await expect(
    mobile(page).getByRole('heading', { name: 'Golden Signal #160' }),
  ).toBeVisible()
  await page.reload()
  await expect(
    mobile(page).getByRole('heading', { name: 'Golden Signal #160' }),
  ).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL((url) => url.pathname === '/')
  await expect(cards(page)).toHaveCount(8)
  await page.goto('/mercado?item=N%C3%A3o%20existe')
  await expect(mobile(page).getByRole('alert')).toContainText(
    'NFT não encontrado.',
  )
})

test('rotas mobile de entrada e cadastro funcionam com acesso direto', async ({
  page,
}) => {
  await page.goto('/')
  await mobile(page).getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL('/login')
  await expect(
    mobile(page).getByRole('heading', { name: 'Entrar' }),
  ).toBeVisible()
  await mobile(page)
    .getByRole('button', { name: /Novo na Kurio/ })
    .click()
  await expect(page).toHaveURL('/cadastro')
  await page.reload()
  await expect(
    mobile(page).getByRole('heading', { name: 'Criar perfil de colecionador' }),
  ).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL('/login')
})

test('catálogo permanece acessível em largura de tablet sem rolagem lateral', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')
  const desktopCatalog = page
    .locator('.desktop-experience')
    .getByRole('region', { name: 'Catálogo de NFTs' })
  await expect(
    desktopCatalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }))
  expect(width.content).toBeLessThanOrEqual(width.viewport)
})
