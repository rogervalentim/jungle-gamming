import { expect, test } from '@playwright/test'

test('detalhe por ID mostra edições e limita quantidade ao estoque atualizado', async ({
  page,
}) => {
  const detailResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === '/api/nfts/emerald-042',
  )
  await page.goto('/mercado?item=emerald-042')
  const detail = await detailResponse
  expect(detail.fromServiceWorker()).toBe(true)
  expect(detail.status()).toBe(200)
  expect((await detail.json()).editions).toHaveLength(3)

  const panel = page.getByRole('region', {
    name: 'Detalhes de Emerald Ape #042',
  })
  await expect(
    panel.getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await panel.getByRole('button', { name: 'Edição 1/10' }).click()
  await expect(panel.getByText('1.49 ETH', { exact: true })).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Comprar' })).toBeEnabled()

  await page.evaluate(() =>
    window.kurioMocks!.updateNft('emerald-042', {
      editionId: 'emerald-042-edition-2',
      availableQuantity: 2,
    }),
  )
  await expect(panel.getByText('2 disponível(is) nesta edição.')).toBeVisible()
  await panel.getByRole('button', { name: 'Aumentar quantidade' }).click()
  await expect(panel.getByLabel('Quantidade selecionada')).toHaveText('2')
  await expect(
    panel.getByRole('button', { name: 'Aumentar quantidade' }),
  ).toBeDisabled()
  await panel.getByRole('button', { name: 'Edição 1/1, esgotada' }).click()
  await expect(panel.getByText('Esta edição está esgotada.')).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Comprar' })).toBeDisabled()
})

test('detalhe mobile aceita ID e link antigo, trata ausente e recupera falha', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const byId = page.waitForResponse(
    (response) => new URL(response.url()).pathname === '/api/nfts/signal-160',
  )
  await page.goto('/mercado?item=signal-160')
  expect((await byId).fromServiceWorker()).toBe(true)
  await expect(
    page
      .locator('.mobile-flow')
      .getByRole('heading', { name: 'Golden Signal #160' }),
  ).toBeVisible()

  await page.goto('/mercado?item=Golden+Signal+%23160')
  await expect(
    page
      .locator('.mobile-flow')
      .getByRole('heading', { name: 'Golden Signal #160' }),
  ).toBeVisible()
  await page.goto('/mercado?item=nao-existe')
  await expect(page.locator('.mobile-flow').getByRole('alert')).toContainText(
    'NFT não encontrado.',
  )

  await page.addInitScript(() =>
    localStorage.setItem('kurio-mock-scenario', 'error'),
  )
  await page.goto('/mercado?item=emerald-042')
  await expect(page.locator('.mobile-flow').getByRole('alert')).toContainText(
    'Não foi possível carregar o NFT.',
  )
  await page.evaluate(() => localStorage.removeItem('kurio-mock-scenario'))
  await page
    .locator('.mobile-flow')
    .getByRole('button', { name: 'Tentar novamente' })
    .click()
  await expect(
    page
      .locator('.mobile-flow')
      .getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
})
