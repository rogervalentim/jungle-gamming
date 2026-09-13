import { nftFixtures } from './fixtures'
import { isEthAmount } from '#/lib/eth'
import type { NftDto } from '#/api/nfts'

export const DATABASE_KEY = 'kurio-mock-db-v1'
export const scenarios = ['success', 'empty', 'slow', 'error', 'declined', 'pending', 'timeout', 'offline', 'expired', 'variable'] as const
export type MockScenario = (typeof scenarios)[number]
export interface MockConfig {
  scenario: MockScenario
  latencyMs: number | null
}

export interface MockEdition {
  id: string
  label: string
  price: string
  availableQuantity: number
  version: number
}

export interface MockNft {
  id: string
  name: string
  assetId: string
  isNew: boolean
  genre: string
  network: string
  version: number
  editions: MockEdition[]
}

export interface MockUser {
  id: string
  email: string
  profile: {
    name: string
    avatar: string | null
    username?: string
    bio?: string
    ens?: string
  }
  credential: {
    algorithm: 'PBKDF2-SHA256'
    iterations: number
    salt: string
    hash: string
  }
}

export interface MockCartItem {
  nftId: string
  editionId: string
  quantity: number
}

export interface MockWallet {
  id: string
  label: string
  address: string
  network: string
  primary: boolean
}

export interface MockOrder {
  id: string
  userId: string
  idempotencyKey: string
  quoteId: string
  walletId: string
  provider: string
  version: number
  status: 'pending' | 'confirmed' | 'declined'
  settleAt?: number
  createdAt: string
  items: Array<MockCartItem & { name: string; price: string }>
  subtotal: string
  discount: string
  networkFee: string
  total: string
}

export interface MockUserData {
  favoriteIds: string[]
  cartItems: MockCartItem[]
  walletIds: string[]
  orderIds: string[]
}

export interface MockDatabase {
  schemaVersion: 1
  resetToken: string
  revision: number
  config: MockConfig
  nfts: MockNft[]
  users: MockUser[]
  userData: Record<string, MockUserData>
  guestCart: MockCartItem[]
  wallets: Record<string, MockWallet & { userId: string }>
  orders: Record<string, MockOrder>
  sessions: Record<string, { id: string; userId: string; expiresAt: string }>
}

export function isScenario(value: unknown): value is MockScenario {
  return typeof value === 'string' && scenarios.some((item) => item === value)
}

export function createDatabase(): MockDatabase {
  return {
    schemaVersion: 1,
    resetToken: crypto.randomUUID(),
    revision: 1,
    config: { scenario: 'success', latencyMs: null },
    nfts: nftFixtures.map((item) => ({
      id: item.id,
      name: item.name,
      assetId: item.id,
      isNew: item.isNew,
      genre: item.genre,
      network: item.network,
      version: 1,
      editions: [
        {
          id: `${item.id}-edition-1`,
          label: item.edition,
          price: item.price,
          availableQuantity: Number(item.edition.split('/')[1]),
          version: 1,
        },
        ...(item.id === 'emerald-042'
          ? [
              {
                id: 'emerald-042-edition-2',
                label: '1/10',
                price: '1.49',
                availableQuantity: 10,
                version: 1,
              },
              {
                id: 'emerald-042-edition-3',
                label: '1/1',
                price: '2.19',
                availableQuantity: 0,
                version: 1,
              },
            ]
          : []),
      ],
    })),
    users: [
      {
        id: 'collector-ana',
        email: 'ana@kurio.test',
        profile: { name: 'Ana Silva', avatar: null },
        credential: {
          algorithm: 'PBKDF2-SHA256',
          iterations: 210000,
          salt: 'kurio-demo-ana-v1',
          hash: '22345ffd000aedc520884d0794d9ce42d1925d67c46b22645cac454846798866',
        },
      },
      {
        id: 'collector-bruno',
        email: 'bruno@kurio.test',
        profile: { name: 'Bruno Costa', avatar: null },
        credential: {
          algorithm: 'PBKDF2-SHA256',
          iterations: 210000,
          salt: 'kurio-demo-bruno-v1',
          hash: '96f538ad88fd80403ff8208283687fdb7782dc4ca890ca9d2981a3a9855f54d3',
        },
      },
    ],
    userData: {
      'collector-ana': {
        favoriteIds: [],
        cartItems: [],
        walletIds: [],
        orderIds: [],
      },
      'collector-bruno': {
        favoriteIds: [],
        cartItems: [],
        walletIds: [],
        orderIds: [],
      },
    },
    guestCart: [],
    wallets: {},
    orders: {},
    sessions: {},
  }
}

function ensureDemoEditions(db: MockDatabase): MockDatabase {
  const emerald = db.nfts.find((item) => item.id === 'emerald-042')
  if (!emerald) return db
  const additions = createDatabase()
    .nfts[0].editions.slice(1)
    .filter(
      (edition) =>
        !emerald.editions.some((current) => current.id === edition.id),
    )
  if (!additions.length) return db
  emerald.editions.push(...additions)
  emerald.version += 1
  db.revision += 1
  localStorage.setItem(DATABASE_KEY, JSON.stringify(db))
  return db
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isLatency(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === 'number' &&
      Number.isSafeInteger(value) &&
      value >= 0 &&
      value <= 5000)
  )
}

function isEdition(value: unknown): value is MockEdition {
  return (
    record(value) &&
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    isEthAmount(value.price) &&
    typeof value.availableQuantity === 'number' &&
    Number.isSafeInteger(value.availableQuantity) &&
    value.availableQuantity >= 0 &&
    typeof value.version === 'number' &&
    Number.isSafeInteger(value.version) &&
    value.version > 0
  )
}

function isCartItem(value: unknown): value is MockCartItem {
  return (
    record(value) &&
    typeof value.nftId === 'string' &&
    typeof value.editionId === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  )
}

function isDatabase(value: unknown): value is MockDatabase {
  if (
    !record(value) ||
    value.schemaVersion !== 1 ||
    typeof value.resetToken !== 'string' ||
    !value.resetToken ||
    typeof value.revision !== 'number' ||
    !Number.isSafeInteger(value.revision) ||
    value.revision < 1 ||
    !record(value.config) ||
    !isScenario(value.config.scenario) ||
    !isLatency(value.config.latencyMs)
  )
    return false
  if (
    !Array.isArray(value.nfts) ||
    value.nfts.length !== nftFixtures.length ||
    !value.nfts.every(
      (item) =>
        record(item) &&
        typeof item.id === 'string' &&
        nftFixtures.some((fixture) => fixture.id === item.id) &&
        nftFixtures.some((fixture) => fixture.id === item.assetId) &&
        typeof item.name === 'string' &&
        typeof item.isNew === 'boolean' &&
        typeof item.genre === 'string' &&
        ['arte-digital', 'fotografia', 'musica', 'arte-3d'].includes(
          item.genre,
        ) &&
        typeof item.network === 'string' &&
        ['ethereum', 'polygon', 'solana'].includes(item.network) &&
        typeof item.version === 'number' &&
        Number.isSafeInteger(item.version) &&
        item.version > 0 &&
        Array.isArray(item.editions) &&
        item.editions.length > 0 &&
        item.editions.every(isEdition),
    )
  )
    return false
  if (new Set(value.nfts.map((item) => item.id)).size !== value.nfts.length)
    return false
  const nfts = value.nfts
  const editionIds = value.nfts.flatMap((item) =>
    item.editions.map((edition: MockEdition) => edition.id),
  )
  if (new Set(editionIds).size !== editionIds.length) return false
  const users = value.users
  if (!Array.isArray(users)) return false
  if (
    users.length < 2 ||
    !['collector-ana', 'collector-bruno'].every((id) =>
      users.some((user) => record(user) && user.id === id),
    ) ||
    !users.every(
      (user) =>
        record(user) &&
        typeof user.id === 'string' &&
        user.id.length > 0 &&
        typeof user.email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
        record(user.profile) &&
        typeof user.profile.name === 'string' &&
        user.profile.name.length > 0 &&
        (user.profile.avatar === null ||
          typeof user.profile.avatar === 'string') &&
        record(user.credential) &&
        user.credential.algorithm === 'PBKDF2-SHA256' &&
        user.credential.iterations === 210000 &&
        typeof user.credential.salt === 'string' &&
        typeof user.credential.hash === 'string' &&
        /^[a-f0-9]{64}$/.test(user.credential.hash),
    )
  )
    return false
  if (
    new Set(users.map((user) => user.id)).size !== users.length ||
    new Set(users.map((user) => user.email.toLowerCase())).size !== users.length
  )
    return false
  if (
    !record(value.userData) ||
    !Array.isArray(value.guestCart) ||
    !record(value.wallets) ||
    !record(value.orders) ||
    !record(value.sessions)
  )
    return false
  const wallets = value.wallets
  const orders = value.orders
  if (
    Object.keys(value.userData).length !== users.length
  )
    return false
  const validCartItem = (item: unknown) =>
    isCartItem(item) &&
    nfts.some(
      (nft: MockNft) =>
        nft.id === item.nftId &&
        nft.editions.some((edition) => edition.id === item.editionId),
    )
  if (!value.guestCart.every(validCartItem)) return false
  if (
    Object.entries(value.wallets).some(
      ([id, wallet]) =>
        !record(wallet) ||
        wallet.id !== id ||
        typeof wallet.userId !== 'string' ||
        !users.some((user) => user.id === wallet.userId) ||
        typeof wallet.label !== 'string' ||
        !wallet.label.trim() ||
        typeof wallet.address !== 'string' ||
        !wallet.address.trim() ||
        !['ethereum', 'polygon', 'solana'].includes(String(wallet.network)) ||
        typeof wallet.primary !== 'boolean',
    ) ||
    Object.entries(value.orders).some(
      ([id, order]) =>
        !record(order) ||
        order.id !== id ||
        typeof order.userId !== 'string' ||
        !users.some((user) => user.id === order.userId) ||
        typeof order.idempotencyKey !== 'string' ||
        typeof order.quoteId !== 'string' ||
        typeof order.walletId !== 'string' ||
        typeof order.provider !== 'string' ||
        typeof order.version !== 'number' ||
        !['pending', 'confirmed', 'declined'].includes(String(order.status)) ||
        (order.status === 'pending' &&
          (typeof order.settleAt !== 'number' || !Number.isFinite(order.settleAt))) ||
        typeof order.createdAt !== 'string' ||
        !Array.isArray(order.items) ||
        !order.items.every(validCartItem) ||
        ![order.subtotal, order.discount, order.networkFee, order.total].every(
          isEthAmount,
        ),
    )
  )
    return false
  if (
    Object.entries(value.sessions).some(
      ([token, session]) =>
        !token ||
        !record(session) ||
        session.id !== token ||
        typeof session.userId !== 'string' ||
        !users.some((user) => user.id === session.userId) ||
        typeof session.expiresAt !== 'string' ||
        !Number.isFinite(Date.parse(session.expiresAt)),
    )
  )
    return false
  const userData = value.userData
  return users.every((user) => {
    const data = userData[user.id]
    return (
      record(data) &&
      Array.isArray(data.favoriteIds) &&
      new Set(data.favoriteIds).size === data.favoriteIds.length &&
      data.favoriteIds.every(
        (id: unknown) =>
          typeof id === 'string' &&
          nfts.some((nft: MockNft) => nft.id === id),
      ) &&
      Array.isArray(data.cartItems) &&
      data.cartItems.every(validCartItem) &&
      Array.isArray(data.walletIds) &&
      data.walletIds.every(
        (id: unknown) =>
          typeof id === 'string' &&
          record(wallets[id]) &&
          wallets[id].userId === user.id,
      ) &&
      Array.isArray(data.orderIds) &&
      data.orderIds.every(
        (id: unknown) =>
          typeof id === 'string' &&
          record(orders[id]) &&
          orders[id].userId === user.id,
      )
    )
  })
}

// Read the persisted source on each operation, including after artificial delay.
// A parse/schema failure restores a seed; denied/quota storage writes are errors.
export function readDatabase(): MockDatabase {
  const saved = localStorage.getItem(DATABASE_KEY)
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved)
      if (isDatabase(parsed)) return ensureDemoEditions(parsed)
      // Upgrade the eight-item seed without discarding valid persisted NFT edits.
      if (
        record(parsed) &&
        parsed.schemaVersion === 1 &&
        Array.isArray(parsed.nfts) &&
        parsed.nfts.length === 8 &&
        parsed.nfts.every(
          (item, index) =>
            record(item) &&
            item.id === nftFixtures[index].id &&
            item.assetId === nftFixtures[index].id,
        )
      ) {
        const seed = createDatabase()
        const migrated = {
          ...parsed,
          nfts: seed.nfts.map((item, index) =>
            index < 8
              ? {
                  ...(parsed.nfts as Record<string, unknown>[])[index],
                  genre: item.genre,
                  network: item.network,
                }
              : item,
          ),
        }
        if (isDatabase(migrated)) {
          localStorage.setItem(DATABASE_KEY, JSON.stringify(migrated))
          return ensureDemoEditions(migrated)
        }
      }
    } catch {
      /* malformed JSON is replaced with a known seed */
    }
  }
  const seed = createDatabase()
  localStorage.setItem(DATABASE_KEY, JSON.stringify(seed))
  return seed
}

export function changeDatabase(change: (draft: MockDatabase) => void) {
  const draft = readDatabase()
  change(draft)
  draft.revision += 1
  localStorage.setItem(DATABASE_KEY, JSON.stringify(draft))
  return draft
}

export function resetDatabase() {
  const seed = createDatabase()
  localStorage.setItem(DATABASE_KEY, JSON.stringify(seed))
  // Explicit app-owned legacy keys only; other applications' data is preserved.
  for (const key of [
    'kurio-mock-scenario',
    'kurio-cart',
    'kurio-cart-v2',
    'kurio-favorites',
    'kurio-auth-token',
  ])
    localStorage.removeItem(key)
  return seed
}

export function getConfig(db: MockDatabase): MockConfig {
  // Compatibility with the documented 1A console recipes and tests.
  const legacyScenario = localStorage.getItem('kurio-mock-scenario')
  return {
    ...db.config,
    scenario: isScenario(legacyScenario) ? legacyScenario : db.config.scenario,
  }
}

export function listNfts(db: MockDatabase): NftDto[] {
  return db.nfts.map((nft) => {
    const edition = nft.editions[0]
    return {
      id: nft.id,
      name: nft.name,
      isNew: nft.isNew,
      genre: nft.genre,
      network: nft.network,
      image: nftFixtures.find((asset) => asset.id === nft.assetId)!.image,
      currency: 'ETH' as const,
      edition: edition.label,
      editionId: edition.id,
      price: edition.price,
      availableQuantity: edition.availableQuantity,
      version: nft.version,
      editions: nft.editions.map((item) => ({ ...item })),
    }
  })
}
