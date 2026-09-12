import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { Button } from './ui/button'
import { Separator } from './ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

import SearchIcon from '#/assets/icons/search-icon.svg'
import CartIcon from '#/assets/icons/cart-icon.svg'
import LoginIcon from '#/assets/icons/login-icon.svg'

const inputClassName =
  'h-10 w-full rounded-[5px] border border-[#48291C] bg-transparent px-3.75 text-sm text-[#F5F1EB] outline-none placeholder:text-[#B39463] focus:border-[#D28A4C] focus:ring-1 focus:ring-[#D28A4C]'

const socialButtonClassName =
  'flex h-10 w-full items-center justify-center gap-3 rounded-[5px] border border-[#48291C] bg-transparent text-[13px] font-medium text-[#CFB28C] shadow-none hover:bg-[#332019] hover:text-[#F5F1EB]'

export function Navbar() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function changeAuthMode(createAccount: boolean) {
    setIsCreatingAccount(createAccount)
    setShowPassword(false)
  }

  return (
    <header className="hidden m-auto lg:flex w-full max-w-300 items-center pt-6">
      <nav className="flex w-full items-center justify-between border-b-[0.3px] border-b-[#D28A4C] pb-2.5">
        <h3 className="text-sm font-bold text-[#F5F1EB]">Kurio</h3>

        <ul className="flex items-center gap-10">
          <li>
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-base transition-colors hover:text-[#E89B55]"
              activeProps={{
                className: 'font-bold text-[#E89B55]',
              }}
              inactiveProps={{
                className: 'font-normal text-[#F5F1EB]',
              }}
            >
              Início
            </Link>
          </li>

          <li>
            <Link
              to="/mercado"
              className="text-base transition-colors hover:text-[#E89B55]"
              activeProps={{
                className: 'font-bold text-[#E89B55]',
              }}
              inactiveProps={{
                className: 'font-normal text-[#F5F1EB]',
              }}
            >
              Mercado
            </Link>
          </li>

          <li>
            <a href="#" className="text-base text-[#F5F1EB]">
              Criadores
            </a>
          </li>

          <li>
            <a href="#" className="text-base text-[#F5F1EB]">
              Aprenda
            </a>
          </li>
        </ul>

        <ul className="flex items-center gap-7">
          <li>
            <a href="#" aria-label="Buscar">
              <img src={SearchIcon} alt="" />
            </a>
          </li>

          <li>
            <a href="" aria-label="Carrinho">
              <img src={CartIcon} alt="" />
            </a>
          </li>

          <li>
            <Dialog
              onOpenChange={(open) => {
                if (open) changeAuthMode(false)
              }}
            >
              <DialogTrigger
                render={
                  <Button className="flex h-8.75 w-25 items-center justify-center gap-1 rounded-md bg-[#D28A4C] text-base font-medium text-[#140D0A] hover:bg-[#E89B55]">
                    <img src={LoginIcon} alt="" />
                    Entrar
                  </Button>
                }
              />

              <DialogContent
                className="
                  block max-h-[90dvh] w-[calc(100%-2rem)]
                  overflow-y-auto rounded-[8px]
                  border-0 border-b-10 border-[#D28A4C]
                  bg-[#241612] p-0 font-mono text-[#F5F1EB]
                  ring-0 sm:max-w-125
                  [&>button]:text-[#D28A4C]
                "
              >
                <DialogHeader className="gap-0 pt-11 text-center">
                  <DialogTitle className="flex items-center justify-center gap-2 text-xl font-medium tracking-wide">
                    <button
                      type="button"
                      onClick={() => changeAuthMode(false)}
                      aria-pressed={!isCreatingAccount}
                      className={`cursor-pointer transition-colors hover:text-[#E89B55] ${
                        !isCreatingAccount ? 'text-[#E89B55]' : 'text-[#F5F1EB]'
                      }`}
                    >
                      Entrar
                    </button>

                    <Separator
                      orientation="vertical"
                      className="h-5 w-px bg-[#F0805F]"
                    />

                    <button
                      type="button"
                      onClick={() => changeAuthMode(true)}
                      aria-pressed={isCreatingAccount}
                      className={`cursor-pointer transition-colors hover:text-[#E89B55] ${
                        isCreatingAccount ? 'text-[#E89B55]' : 'text-[#F5F1EB]'
                      }`}
                    >
                      Criar conta
                    </button>
                  </DialogTitle>

                  <DialogDescription className="mt-9 px-6 text-center text-[13px] leading-4 text-[#F5F1EB] sm:px-10">
                    {isCreatingAccount
                      ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
                      : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
                  </DialogDescription>
                </DialogHeader>

                <div className="mx-auto w-[calc(100%-3rem)] max-w-85 pt-6 pb-23.25">
                  <form
                    key={isCreatingAccount ? 'register' : 'login'}
                    onSubmit={(event) => {
                      event.preventDefault()

                      const form = event.currentTarget
                      const data = new FormData(form)

                      if (isCreatingAccount) {
                        const confirmInput =
                          form.elements.namedItem('confirmPassword')

                        if (
                          confirmInput instanceof HTMLInputElement &&
                          data.get('password') !== data.get('confirmPassword')
                        ) {
                          confirmInput.setCustomValidity(
                            'As senhas não coincidem.',
                          )
                          confirmInput.reportValidity()
                          return
                        }

                        // Conecte aqui sua função de cadastro.
                        // Campos em `data`: username, email,
                        // password e confirmPassword.
                      } else {
                        // Conecte aqui sua função de login.
                        // Campos em `data`: email e password.
                      }
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      {isCreatingAccount && (
                        <div>
                          <label htmlFor="auth-username" className="sr-only">
                            Nome de usuário
                          </label>

                          <input
                            id="auth-username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            placeholder="Nome de usuário"
                            required
                            className={inputClassName}
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="auth-email" className="sr-only">
                          E-mail
                        </label>

                        <input
                          id="auth-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder={
                            isCreatingAccount
                              ? 'Digite seu e-mail'
                              : 'contato@email.com'
                          }
                          required
                          className={inputClassName}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="auth-password" className="sr-only">
                          Senha
                        </label>

                        <input
                          id="auth-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete={
                            isCreatingAccount
                              ? 'new-password'
                              : 'current-password'
                          }
                          placeholder={
                            isCreatingAccount ? 'Senha' : '***********'
                          }
                          required
                          onChange={(event) => {
                            const confirmInput =
                              event.currentTarget.form?.elements.namedItem(
                                'confirmPassword',
                              )

                            if (confirmInput instanceof HTMLInputElement) {
                              confirmInput.setCustomValidity('')
                            }
                          }}
                          className={`${inputClassName} pr-12 ${
                            !isCreatingAccount
                              ? 'border-[#D28A4C] placeholder:text-[#F5F1EB]'
                              : ''
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setShowPassword((current) => !current)
                          }}
                          aria-label={
                            showPassword ? 'Ocultar senha' : 'Mostrar senha'
                          }
                          aria-pressed={showPassword}
                          className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-[#B39463] hover:text-[#D28A4C]"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {!showPassword && <path d="m3 21 18-18" />}
                          </svg>
                        </button>
                      </div>

                      {isCreatingAccount && (
                        <div>
                          <label
                            htmlFor="auth-confirm-password"
                            className="sr-only"
                          >
                            Confirmar senha
                          </label>

                          <input
                            id="auth-confirm-password"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Confirmar senha"
                            required
                            onChange={(event) => {
                              event.currentTarget.setCustomValidity('')
                            }}
                            className={inputClassName}
                          />
                        </div>
                      )}
                    </div>

                    {!isCreatingAccount && (
                      <div className="mt-2.5 text-right">
                        <a
                          href="/recuperar-senha"
                          className="text-sm text-[#D28A4C] hover:underline"
                        >
                          Esqueceu a senha?
                        </a>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className={`
                        h-11.25 w-full rounded-[5px]
                        bg-[#D28A4C] text-base font-bold text-[#140D0A]
                        hover:bg-[#E89B55]
                        ${isCreatingAccount ? 'mt-6' : 'mt-5.5'}
                      `}
                    >
                      {isCreatingAccount ? 'Criar conta' : 'Entrar'}
                    </Button>
                  </form>

                  <div className="my-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-[#48291C]" />

                    <span className="text-[13px] text-[#F5F1EB]">
                      Ou continue com
                    </span>

                    <span className="h-px flex-1 bg-[#48291C]" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className={socialButtonClassName}
                      onClick={() => {
                        // Conecte aqui a autenticação com Google.
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.41 13.93a6 6 0 0 1 0-3.86V7.48H3.07a10 10 0 0 0 0 9.04l3.34-2.59Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.95c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.48l3.34 2.59C7.2 7.71 9.4 5.95 12 5.95Z"
                        />
                      </svg>
                      Continuar com Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className={socialButtonClassName}
                      onClick={() => {
                        // Conecte aqui a autenticação com Facebook.
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#4267A9"
                        aria-hidden="true"
                      >
                        <path d="M14 22v-9h3l.5-4H14V7c0-1.16.32-2 2-2h2V1.4A25 25 0 0 0 15 1c-3 0-5 1.82-5 5v3H7v4h3v9h4Z" />
                      </svg>
                      Continuar com Facebook
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </header>
  )
}
