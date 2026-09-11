import Star from '#/assets/icons/star.svg'
import Minus from '#/assets/icons/minus-icon.svg'
import Plus from '#/assets/icons/plus-icon.svg'
import Heart from '#/assets/icons/heart.svg'
import LinkedinWhite from '#/assets/icons/linkedin-white.svg'
import Message from '#/assets/icons/message.svg'
import TwitterWhite from '#/assets/icons/twitter-white.svg'

import { Button } from '@base-ui/react/button'

export function NftData() {
  return (
    <section className="w-full max-w-[50%]">
      <h2 className="text-[28px] font-bold text-[#F5F1EB] mb-3">
        Emerald Ape #042
      </h2>

      <div className="flex justify-between items-center border-b-[0.3px] mb-[13.37px] pb-3 border-[#D28A4C]">
        <p className="text-[22px] font-bold leading-4 text-[#E89B55]">
          1.19 ETH
        </p>

        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
          </div>
          <span className="text-base font-regular text-[#F5F1EB]">
            19 avaliações de colecionadores
          </span>
        </div>
      </div>

      <h4 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
        Sobre este NFT:
      </h4>
      <p className="text-sm font-normal text-[#CFB28C] leading-6 mb-[13.38px]">
        Um colecionável digital finalizado à mão da coleção Kurio Editions,
        verificado na Ethereum, com arte desbloqueável e acesso para
        colecionadores.
      </p>

      <h4 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
        Edição:
      </h4>

      <div className="flex gap-1 mb-[13.37px]">
        <span className="px-px py-1.5 rounded-full flex items-center justify-center border border-[#3F2319] text-sm leading-4 font-normal text-[#CFB28C]">
          1/1
        </span>
        <span className="px-1 py-1.5 rounded-full flex items-center justify-center border border-[#3F2319] text-sm leading-4 font-normal text-[#CFB28C]">
          1/10
        </span>
        <div className="px-1 py-1.5 rounded-full flex items-center justify-center border border-[#D28A4C] text-sm leading-4 font-medium text-[#E89B55]">
          1/50
        </div>
        <span className="px-1 py-1.5 uppercase rounded-full flex items-center justify-center border border-[#3F2319] text-sm leading-4 font-normal text-[#CFB28C]">
          Aberta
        </span>
      </div>

      <div className="flex justify-between items-center mb-[13.38px]">
        <div className="flex gap-3 items-center w-full">
          <Button className="w-8.25 h-[49.5px] flex justify-center items-center rounded-[33px] bg-[#D28A4C]">
            <img src={Minus} alt="minus icon" />
          </Button>
          <span className="text-[20px] leading-7 font-normal text-[#F5F1EB]">
            1
          </span>
          <Button className="w-8.25 h-[49.5px] flex justify-center items-center rounded-[33px] bg-[#D28A4C]">
            <img src={Plus} alt="minus icon" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <Button className="h-10 w-full max-w-32.5 flex items-center justify-center rounded-md bg-[#D28A4C] font-bold text-sm leading-5 text-[#140D0A]">
            Comprar
          </Button>
          <Button className="h-10 w-full max-w-32.5 flex items-center gap-2 justify-center rounded-md border border-[#D28A4C] font-medium text-sm leading-5 text-[#E89B55]">
            <span>
              <img src={Heart} alt="icone de coração" />
            </span>
            Favoritar
          </Button>
        </div>
      </div>

      <p className="text-base font-normal text-[#B39463]">ID do token: #0042</p>
      <p className="text-base font-normal text-[#B39463]">
        Coleção: Kurio Apes
      </p>
      <p className="text-base font-normal text-[#B39463] mb-2">
        Atributos: Óculos, Esmeralda, Raro
      </p>
      <div className="flex items-center gap-2">
        <h4 className="text-[#F7F3EC] font-bold text-base leading-4">
          Compartilhar este NFT:
        </h4>
        <ul className="flex items-center gap-2">
          <li>
            <a href="#">
              <img src={LinkedinWhite} alt="icone do linkedin branco" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={Message} alt="icone do email branco" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={TwitterWhite} alt="icone do twitter branco" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
