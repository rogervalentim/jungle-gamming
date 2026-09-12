import { Separator } from './ui/separator'

import Facebook from '#/assets/icons/facebook.svg'
import Instagram from '#/assets/icons/instagram.svg'
import Twitter from '#/assets/icons/twitter.svg'
import Linkedin from '#/assets/icons/linkedin.svg'
import Youtube from '#/assets/icons/youtube.svg'
import { Wallet } from './wallet'

export function Footer() {
  return (
    <>
      <footer className="hidden w-full max-w-300 m-auto lg:block">
        {/* secao 1 */}
        <div className="flex justify-between gap-4.25 bg-[#241612] pt-8 pl-8 pb-4 pr-7.5">
          <div className="w-full max-w-62.5">
            <div className="w-18.5 h-18.5 rounded-[37px] flex items-center justify-center bg-[#D28A4C] mb-3">
              <p className="font-bold text-[#140D0A] text-[24px] uppercase">
                W
              </p>
            </div>
            <h3 className="text-base font-bold text-[#F5F1EB] mb-3">
              Segurança da carteira
            </h3>
            <p className="font-normal text-sm text-[#CFB28C]">
              Proteja sua carteira e colecione arte digital <br /> verificada
              com
              <br />
              confiança.
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="h-50.5 w-px bg-[#D28A4C] "
          />
          <div className="w-full max-w-62.5">
            <div className="w-18.5 h-18.5 rounded-[37px] flex items-center justify-center bg-[#D28A4C] mb-3">
              <p className="font-bold text-[#140D0A] text-[24px] uppercase">
                C
              </p>
            </div>
            <h3 className="text-base font-bold text-[#F5F1EB] mb-3">
              Criadores em destaque
            </h3>
            <p className="font-normal text-sm text-[#CFB28C]">
              Conheça artistas, estúdios e comunidades que moldam a cultura
              digital na rede.
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="h-50.5 w-px bg-[#D28A4C] "
          />
          <div className="w-full max-w-62.5">
            <div className="w-18.5 h-18.5 rounded-[37px] flex items-center justify-center bg-[#D28A4C] mb-3">
              <p className="font-bold text-[#140D0A] text-[24px] uppercase">
                D
              </p>
            </div>
            <h3 className="text-base font-bold text-[#F5F1EB] mb-3">
              Alertas de lançamentos
            </h3>
            <p className="font-normal text-sm text-[#CFB28C]">
              Receba calendários de cunhagem, novidades de listas de acesso e
              análises do mercado.
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="h-50.5 w-px bg-[#D28A4C] "
          />
          <div>
            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-4">
              Antecipe-se ao próximo lançamento
            </h3>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="digite seu e-mail..."
                className="bg-[#38220F] rounded-l-md  h-10 pl-3 w-full max-w-60 placeholder:text-sm placeholder:text-[#B39463] placeholder:font-normal"
              />
              <a
                href="#"
                className="rounded-r-md w-full max-w-21.25 h-10 bg-[#D28A4C] flex items-center justify-center text-[18px] font-bold text-[#140D0A]"
              >
                Enviar
              </a>
            </div>
            <p className="font-normal text-[13px] text-[#CFB28C]">
              Receba lançamentos selecionados, histórias de criadores e
              novidades do mercado.
            </p>
          </div>
        </div>
        {/* secao 2 */}
        <div className="flex gap-23 items-center w-full py-8.75 pl-8 bg-[#38220F]">
          <h3 className=" w-full font-bold text-sm text-[#F5F1EB]">Kurio</h3>
          <p className=" w-full text-sm font-normal text-[#F5F1EB]">
            Feito para colecionadores, criadores e cultura
          </p>
          <a href="#" className=" w-full text-sm font-normal text-[#F5F1EB]">
            contato@email.com
          </a>
          <a href="#" className=" w-full text-sm font-normal text-[#F5F1EB]">
            +55 11 4002 8922
          </a>
        </div>

        <div className="pt-8 pb-7.5 px-7.5 bg-[#241612] flex justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-2">
              Meu perfil
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Meu perfil
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Minha coleção
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Atividade
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Estúdio do criador
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Lista de interesse
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-2">
              Central de ajuda
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Central de ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Como comprar NFTs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Carteira e segurança
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Política do mercado
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Denunciar item
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-2">
              Coleções
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Arte digital
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Fotografia
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Música
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Arte 3D
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-[#F5F1EB]">
                  Utilidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-5">
              Redes sociais
            </h3>
            <ul className="flex gap-2.5 items-center mb-8">
              <li>
                <a
                  href="#"
                  className="w-7.5 h-7.5 flex items-center justify-center rounded-sm border border-[#D28A4C]"
                >
                  <img src={Facebook} alt="facebook icon" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-7.5 h-7.5 flex items-center justify-center rounded-sm border border-[#D28A4C]"
                >
                  <img src={Instagram} alt="instagram icon" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-7.5 h-7.5 flex items-center justify-center rounded-sm border border-[#D28A4C]"
                >
                  <img src={Twitter} alt="twitter icon" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-7.5 h-7.5 flex items-center justify-center rounded-sm border border-[#D28A4C]"
                >
                  <img src={Linkedin} alt="linkedin icon" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-7.5 h-7.5 flex items-center justify-center rounded-sm border border-[#D28A4C]"
                >
                  <img src={Youtube} alt="youtube icon" />
                </a>
              </li>
            </ul>

            <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-3">
              Carteiras compatíveis
            </h3>

            <Wallet />
          </div>
        </div>
        <p className="font-normal text-sm text-[#F5F1EB] text-center pt-1.5 pb-6">
          &copy; 2026 Kurio. Propriedade digital para todos.
        </p>
      </footer>
      <MobileFooter />
    </>
  )
}

// Barra inferior exibida em celulares e tablets.
export function MobileFooter() {
  const iconClass = 'h-5 w-5 fill-current'

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 h-24 rounded-[32px] bg-[#241612] pb-[env(safe-area-inset-bottom)] text-[#D9BB94] lg:hidden"
    >
      <div className="mx-auto grid h-full max-w-xl grid-cols-5 items-center px-2">
        <a
          href="/"
          aria-label="Início"
          aria-current="page"
          className="flex h-14 items-center justify-center text-[#F3A85E]"
        >
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M12 2.7 2.5 10v10a2 2 0 0 0 2 2H9v-7h6v7h4.5a2 2 0 0 0 2-2V10L12 2.7Z" />
          </svg>
        </a>
        <a
          href="/favoritos"
          aria-label="Favoritos"
          className="flex h-14 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M12 21.3 3.6 13.2A6 6 0 0 1 12 4.7a6 6 0 0 1 8.4 8.5L12 21.3Z" />
          </svg>
        </a>
        <div aria-hidden="true" />
        <a
          href="/carrinho"
          aria-label="Carrinho"
          className="flex h-14 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M2 3h3l2.2 11.1A2 2 0 0 0 9.2 16H19a2 2 0 0 0 2-1.6L22 8H6M10 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          </svg>
        </a>
        <a
          href="/perfil"
          aria-label="Perfil"
          className="flex h-14 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-5 0-8 2.6-8 5.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5C20 16.6 17 14 12 14Z" />
          </svg>
        </a>
      </div>
      <a
        href="/explorar"
        aria-label="Explorar"
        className="absolute left-1/2 top-7.5 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#D28A4C] text-white shadow-[0_0_0_8px_#241612]"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-8 w-8 fill-none stroke-current stroke-[1.5]"
          aria-hidden="true"
        >
          <path
            d="M5 12V9a4 4 0 0 1 4-4h3M20 5h3a4 4 0 0 1 4 4v3M27 20v3a4 4 0 0 1-4 4h-3M12 27H9a4 4 0 0 1-4-4v-3M3 16h26"
            strokeLinecap="round"
          />
        </svg>
      </a>
    </nav>
  )
}
