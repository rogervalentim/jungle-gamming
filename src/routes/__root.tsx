import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { MobileFlow } from '#/components/mobile-flow'
import { useSyncExternalStore } from 'react'

function subscribeMobile(callback: () => void) {
  const query = window.matchMedia('(max-width: 600px)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

const mobileSnapshot = () => window.matchMedia('(max-width: 600px)').matches

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false)
  const accountPage = useRouterState({
    select: (state) => ['/perfil-do-colecionador', '/carteiras'].includes(state.location.pathname),
  })
  if (mobile && !accountPage) return <MobileFlow />
  return (
    <>
      <div className="desktop-experience [&_button[aria-label='Open_TanStack_Devtools']]:hidden">
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    </>
  )
}
