import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ reducedMotion: 'reduce' })

async function readyImages(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(Array.from(document.images).map(async (image) => {
      if (!image.complete) await new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      })
      if (image.complete && image.naturalWidth) await image.decode().catch(() => null)
    }))
  })
}

async function snapshot(page: Page, name: string) {
  await readyImages(page)
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.01,
  })
}

test('regressão visual de início, detalhe, carrinho e pagamento', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Visualizar / }).first()).toBeVisible()
  await snapshot(page, 'inicio-desktop.png')

  await page.goto('/mercado?item=emerald-042')
  await expect(page.getByRole('region', { name: 'Detalhes de Emerald Ape #042' })).toBeVisible()
  await snapshot(page, 'detalhe-desktop.png')

  await page.evaluate(async () => {
    await fetch('/api/cart/items', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nftId: 'emerald-042', editionId: 'emerald-042-edition-1', quantity: 1 }),
    })
  })
  await page.goto('/carrinho-de-nfts')
  await expect(page.getByRole('region', { name: 'Carrinho de NFTs' })).toBeVisible()
  await snapshot(page, 'carrinho-desktop.png')

  await page.evaluate(async () => {
    const headers = { 'content-type': 'application/json' }
    const account = await (await fetch('/api/auth/login', { method: 'POST', headers,
      body: JSON.stringify({ email: 'ana@kurio.test', password: 'KurioAna!2026' }) })).json()
    localStorage.setItem('kurio-auth-token', account.token)
    await fetch('/api/wallets', { method: 'POST',
      headers: { ...headers, authorization: `Bearer ${account.token}` },
      body: JSON.stringify({ label: 'Principal', address: '0x1234567890abcdef',
        network: 'ethereum', primary: true }) })
  })
  await page.goto('/pagamento')
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
  await snapshot(page, 'pagamento-desktop.png')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('.mobile-flow').getByRole('heading', { name: /SEJA DONO/ })).toBeVisible()
  await snapshot(page, 'inicio-mobile.png')
  await page.goto('/mercado?item=emerald-042')
  await expect(page.locator('.mobile-flow').getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await snapshot(page, 'detalhe-mobile.png')
  await page.goto('/carrinho-de-nfts')
  await expect(page.locator('.mobile-flow').getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
  await expect(page.locator('.mobile-flow').getByText('Emerald Ape #042')).toBeVisible()
  await snapshot(page, 'carrinho-mobile.png')
  await page.goto('/pagamento')
  await expect(page.locator('.mobile-flow').getByRole('heading', { name: 'Pagamento com carteira' })).toBeVisible()
  await snapshot(page, 'pagamento-mobile.png')
})
