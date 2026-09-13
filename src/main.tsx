import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
  stringifySearchWith,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/nfts'
import { parseRouterSearch } from './lib/catalog-search'
import { useEffect } from 'react'
import { useAuthToken } from './lib/auth-token'
import { connectRealtime } from './lib/realtime'

const router = createRouter({
  routeTree,
  parseSearch: parseRouterSearch,
  stringifySearch: stringifySearchWith(JSON.stringify),
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

function App() {
  const token = useAuthToken()
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined
    void connectRealtime(token).then((stop) => {
      if (cancelled) stop()
      else cleanup = stop
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [token])
  return <RouterProvider router={router} />
}

async function start() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker, installMockControls } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
    const cleanup = installMockControls()
    import.meta.hot?.dispose(cleanup)
  }
  if (rootElement.innerHTML) return
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

void start().catch((error: unknown) => {
  console.error('Application startup failed', error)
  rootElement.textContent =
    'Não foi possível iniciar a aplicação. Recarregue a página para tentar novamente.'
  rootElement.setAttribute('role', 'alert')
})
