import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Wallet } from '../wallet'
import Image1 from '#/assets/hero-image.png'

export function NftOrderSummary() {
  return (
    <div className="max-w-full">
      <h4 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
        Seus NFTs
      </h4>

      <div className="flex justify-between pb-3 mb-3 w-full border-b-[0.3px] border-[#D28A4C]">
        <h4 className="text-base font-bold leading-4 text-[#F5F1EB]">NFTs</h4>
        <h4 className="text-base font-bold leading-4 text-[#F5F1EB]">
          Subtotal
        </h4>
      </div>

      <Card className="p-0 ring-0 bg-[#241612] w-full max-w-101.25 mb-3">
        <CardContent className=" p-0  pr-6 flex gap-5 w-full items-center flex-row">
          <div className="flex gap-2 items-center">
            <img
              src={Image1}
              alt="produto no carrinho imagem"
              width="70"
              height="70"
              className="rounded-md"
            />
            <div>
              <CardTitle className="text-base font-bold text-[#F5F1EB]">
                Emerald Ape #042
              </CardTitle>
              <CardDescription className="text-sm font-normal leading-4 text-[#B39463]">
                ID do token: #0042
              </CardDescription>
            </div>
            <span className="text-[#CFB28C] text-sm leading-4 text-right ">
              (x 2)
            </span>
          </div>

          <div className="flex gap-14.5 items-center">
            <span className="text-base leading-4  w-full font-bold text-[#E89B55]">
              2.38 ETH
            </span>
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-sm text-[#F5F1EB] text-center font-normal mb-3">
          Tem um código promocional? Aplique aqui
        </p>

        <ul>
          <li className="flex justify-between items-center mb-3.5">
            <span className="text-base font-normal text-[#F5F1EB]">
              Subtotal
            </span>
            <span className="text-[18px] leading-4 text-[#F5F1EB] text-right">
              26.83 ETH
            </span>
          </li>
          <li className="flex justify-between items-center mb-3.5">
            <span className="text-base font-normal text-[#F5F1EB]">
              Desconto do lançamento
            </span>
            <span className="text-[18px] leading-4 text-[#F5F1EB] text-right">
              (-) 00.00
            </span>
          </li>
          <li className="flex justify-between items-center mb-3.5">
            <span className="text-base font-normal text-[#F5F1EB]">
              Taxa de rede
            </span>
            <span className="text-[18px] leading-4 text-[#F5F1EB] text-right">
              0.016 ETH
            </span>
          </li>
        </ul>

        <div className="w-full border-b-[0.3px] border-[#D28A4C] pb-3 mb-3">
          <p className="text-sm leading-4 font-normal text-[#E89B55] text-center">
            Taxa estimada
          </p>
        </div>

        <ul className="mb-3">
          <li className="flex justify-between px-10.5">
            <span className="text-base leading-4 font-bold text-[#F5F1EB]">
              Total
            </span>
            <span className="text-[18px] leading-4 font-bold text-[#E89B55] text-right">
              26.846 ETH
            </span>
          </li>
        </ul>

        <h3 className="text-base leading-4 text-center text-[#F5F1EB] font-bold mb-5">
          Carteira e rede
        </h3>

        <ul className="mb-6">
          <li className="w-full h-11.25 pl-3 border border-[#3F2319] rounded-[3px] flex gap-2.5 items-center mb-4 has-checked:border-[#D28A4C]">
            <input
              type="radio"
              name="wallet"
              value="wallet"
              className="
        appearance-none
        w-4
        h-4
        rounded-full
        border-[1.2px]
        border-[#D28A4C]
        bg-transparent
        cursor-pointer
        checked:bg-[#D28A4C]
        checked:shadow-[inset_0_0_0_2px_#140D0A]
      "
            />

            <Wallet />
          </li>

          <li className="w-full h-11.25 pl-3 border border-[#3F2319] rounded-[3px] flex gap-2.5 items-center mb-4 has-checked:border-[#D28A4C]">
            <input
              type="radio"
              name="wallet"
              value="metamask"
              className="
        appearance-none
        w-4
        h-4
        rounded-full
        border-[1.2px]
        border-[#D28A4C]
        bg-transparent
        cursor-pointer
        checked:bg-[#D28A4C]
        checked:shadow-[inset_0_0_0_2px_#140D0A]
      "
            />

            <span className="text-base leading-4 text-[#F5F1EB]">MetaMask</span>
          </li>

          <li className="w-full h-11.25 pl-3 border border-[#3F2319] rounded-[3px] flex gap-2.5 items-center has-checked:border-[#D28A4C]">
            <input
              type="radio"
              name="wallet"
              value="coinbase"
              className="
        appearance-none
        w-4
        h-4
        rounded-full
        border-[1.2px]
        border-[#D28A4C]
        bg-transparent
        cursor-pointer
        checked:bg-[#D28A4C]
        checked:shadow-[inset_0_0_0_2px_#140D0A]
      "
            />

            <span className="text-base leading-4 text-[#F5F1EB]">
              Coinbase Wallet
            </span>
          </li>
        </ul>

        <Button className="w-full max-w-101.25 bg-[#D28A4C] h-11.25 rounded-[8px] flex items-center justify-center text-base font-bold leading-4 text-[#140D0A]">
          Confirmar compra
        </Button>
      </div>
    </div>
  )
}
