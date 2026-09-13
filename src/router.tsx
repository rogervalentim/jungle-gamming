import {
  createRouter as createTanStackRouter,
  stringifySearchWith,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { parseRouterSearch } from './lib/catalog-search'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    parseSearch: parseRouterSearch,
    stringifySearch: stringifySearchWith(JSON.stringify),
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
