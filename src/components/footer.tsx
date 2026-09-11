import { Separator } from './ui/separator'

import Facebook from '#/assets/icons/facebook.svg'
import Instagram from '#/assets/icons/instagram.svg'
import Twitter from '#/assets/icons/twitter.svg'
import Linkedin from '#/assets/icons/linkedin.svg'
import Youtube from '#/assets/icons/youtube.svg'
import { Wallet } from './wallet'

export function Footer() {
  return (
    <footer className="w-full max-w-300 m-auto">
      {/* secao 1 */}
      <div className="flex justify-between gap-4.25 bg-[#241612] pt-8 pl-8 pb-4 pr-7.5">
        <div className="w-full max-w-62.5">
          <div className="w-18.5 h-18.5 rounded-[37px] flex items-center justify-center bg-[#D28A4C] mb-3">
            <p className="font-bold text-[#140D0A] text-[24px] uppercase">W</p>
          </div>
          <h3 className="text-base font-bold text-[#F5F1EB] mb-3">
            Segurança da carteira
          </h3>
          <p className="font-normal text-sm text-[#CFB28C]">
            Proteja sua carteira e colecione arte digital <br /> verificada com
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
            <p className="font-bold text-[#140D0A] text-[24px] uppercase">C</p>
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
            <p className="font-bold text-[#140D0A] text-[24px] uppercase">D</p>
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
            Receba lançamentos selecionados, histórias de criadores e novidades
            do mercado.
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
  )
}
