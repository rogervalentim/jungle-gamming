import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  authErrorMessage,
  login,
  logout,
  register,
  useSession,
} from '#/api/auth'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'

function returnPath(href: string) {
  const requested = new URL(href, window.location.origin).searchParams.get(
    'next',
  )
  if (!requested) return '/'
  const target = new URL(requested, window.location.origin)
  return target.origin === window.location.origin &&
    !['/login', '/cadastro'].includes(target.pathname)
    ? `${target.pathname}${target.search}${target.hash}`
    : '/'
}

export function AuthPage({ mode }: { mode: 'login' | 'cadastro' }) {
  const href = useRouterState({ select: (state) => state.location.href })
  const { user, isLoading } = useSession()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'cadastro'
  const destination = returnPath(href)

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-14 text-[#F5F1EB]">
        <h1 className="mb-2 text-3xl font-bold">
          {isRegister ? 'Criar perfil de colecionador' : 'Entrar'}
        </h1>
        {user ? (
          <div className="mt-6 rounded-xl border border-[#48291C] bg-[#241612] p-6">
            <p className="mb-5">
              Você está conectado como {user.profile.name}.
            </p>
            <a
              href={destination}
              className="inline-flex min-h-11 items-center rounded-lg bg-[#D28A4C] px-5 font-bold text-[#140D0A]"
            >
              Continuar
            </a>
            <button
              type="button"
              className="ml-4 text-[#E89B55] underline"
              onClick={() => void logout()}
            >
              Sair
            </button>
          </div>
        ) : isLoading ? (
          <p role="status" className="mt-6">
            Verificando sessão…
          </p>
        ) : (
          <form
            className="mt-6 flex flex-col gap-4 rounded-xl border border-[#48291C] bg-[#241612] p-6"
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const data = new FormData(form)
              const password = String(data.get('password') ?? '')
              if (isRegister && password !== data.get('confirmPassword')) {
                const confirm = form.elements.namedItem('confirmPassword')
                if (confirm instanceof HTMLInputElement) {
                  confirm.setCustomValidity('As senhas não coincidem.')
                  confirm.reportValidity()
                }
                return
              }
              setPending(true)
              setMessage('')
              void (async () => {
                try {
                  const email = String(data.get('email') ?? '')
                  if (isRegister)
                    await register(
                      String(data.get('name') ?? ''),
                      email,
                      password,
                    )
                  else await login(email, password)
                  window.location.assign(destination)
                } catch (error) {
                  setMessage(authErrorMessage(error))
                } finally {
                  setPending(false)
                }
              })()
            }}
          >
            {isRegister && (
              <label className="flex flex-col gap-1.5 text-sm">
                Nome
                <input
                  className="h-11 rounded-md border border-[#633C29] bg-[#1B130E] px-3 text-base"
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5 text-sm">
              E-mail
              <input
                className="h-11 rounded-md border border-[#633C29] bg-[#1B130E] px-3 text-base"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Senha
              <input
                className="h-11 rounded-md border border-[#633C29] bg-[#1B130E] px-3 text-base"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={isRegister ? 8 : undefined}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </label>
            {isRegister && (
              <label className="flex flex-col gap-1.5 text-sm">
                Confirmar senha
                <input
                  className="h-11 rounded-md border border-[#633C29] bg-[#1B130E] px-3 text-base"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  onInput={(event) => event.currentTarget.setCustomValidity('')}
                />
              </label>
            )}
            <label className="flex items-center gap-2 text-sm text-[#CFB28C]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              Mostrar senha
            </label>
            {message && (
              <p role="alert" className="text-sm text-[#F2A368]">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="mt-2 min-h-11 rounded-lg bg-[#D28A4C] px-5 font-bold text-[#140D0A] disabled:opacity-60"
            >
              {pending ? 'Aguarde…' : isRegister ? 'Criar conta' : 'Entrar'}
            </button>
            <Link
              to={isRegister ? '/login' : '/cadastro'}
              className="text-center text-sm text-[#E89B55] underline"
            >
              {isRegister
                ? 'Já tem uma conta? Entre'
                : 'Novo na Kurio? Crie uma conta'}
            </Link>
          </form>
        )}
      </main>
      <Footer />
    </>
  )
}
