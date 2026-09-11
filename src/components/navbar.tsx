import { Button } from './ui/button'

import SearchIcon from '#/assets/icons/search-icon.svg'
import CartIcon from '#/assets/icons/cart-icon.svg'
import LoginIcon from '#/assets/icons/login-icon.svg'
import { Link } from '@tanstack/react-router'

export function Navbar() {
  return (
    <header className="max-w-300 m-auto w-full flex items-center  pt-6">
      <nav className="w-full flex justify-between border-b-[0.3px] pb-2.5 border-b-[#D28A4C] items-center">
        <h3 className="font-bold text-sm text-[#F5F1EB]">Kurio</h3>

        <ul className="flex items-center gap-10">
          <li>
            <Link to="/" className="text-base text-[#F5F1EB]">
              Início
            </Link>
          </li>
          <li>
            <Link to="/nft-details" className="text-base text-[#F5F1EB]">
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

        <ul className="flex gap-7 items-center">
          <li>
            <a href="#">
              <img src={SearchIcon} alt="icone de busca" />
            </a>
          </li>
          <li>
            <a href="">
              <img src={CartIcon} alt="icone do carrinho" />
            </a>
          </li>
          <li>
            <a href="#">
              <Button className="w-25 h-8.75 flex items-center justify-center gap-1 rounded-md bg-[#D28A4C] text-base font-medium text-#140D0A">
                <span>
                  <img src={LoginIcon} alt="icone do login" />
                </span>
                Entrar
              </Button>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
