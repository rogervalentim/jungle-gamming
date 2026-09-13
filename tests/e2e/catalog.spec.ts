import { expect, test } from '@playwright/test'

test('carrega pelo MSW, filtra por categoria e ordena sem perder os preços decimais', async ({
  page,
}) => {
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/nfts?'),
  )
  await page.goto('/')
  const response = await responsePromise
  expect(response.fromServiceWorker()).toBe(true)
  const payload = await response.json()
  expect(payload.items[0].price).toBe('1.19')
  const catalog = page.getByRole('region', { name: 'Catálogo de NFTs' })
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  await catalog.getByRole('tab', { name: 'Novos lançamentos' }).click()
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(5)
  await expect(
    catalog.getByText('Emerald Ape #042', { exact: true }),
  ).toHaveCount(0)
  await catalog.getByRole('tab', { name: 'Em alta', exact: true }).click()
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }).first(),
  ).toHaveAccessibleName('Visualizar Ivory Baron #088')
  await page.reload()
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
})

test('exibe resultado vazio', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('kurio-mock-scenario', 'empty'),
  )
  await page.goto('/')
  const catalog = page.getByRole('region', { name: 'Catálogo de NFTs' })
  await expect(catalog.getByText('Nenhum NFT encontrado.')).toBeVisible()
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(0)
})

test('permite recuperar erro da API pelo botão de nova tentativa', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('kurio-mock-scenario', 'error'),
  )
  await page.goto('/')
  const catalog = page.getByRole('region', { name: 'Catálogo de NFTs' })
  await expect(catalog.getByRole('alert')).toContainText(
    'Não foi possível carregar os NFTs.',
  )
  await page.evaluate(() => localStorage.removeItem('kurio-mock-scenario'))
  await catalog.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  await expect(catalog.getByRole('alert')).toHaveCount(0)
})

test('mostra skeleton durante latência e respeita movimento reduzido', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() =>
    localStorage.setItem('kurio-mock-scenario', 'slow'),
  )
  await page.goto('/')
  const catalog = page.getByRole('region', { name: 'Catálogo de NFTs' })
  await expect(
    catalog.getByRole('status', { name: 'Carregando NFTs' }),
  ).toBeVisible()
  await expect(catalog.locator('.catalog-skeleton').first()).toHaveCSS(
    'animation-name',
    'none',
  )
  await expect(
    catalog.getByRole('button', { name: /^Visualizar / }),
  ).toHaveCount(8)
  await expect(
    catalog.getByRole('status', { name: 'Carregando NFTs' }),
  ).toHaveCount(0)
})
