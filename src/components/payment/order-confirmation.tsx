import ThankYouImage from '#/assets/thank-you.png'
import { Separator } from '../ui/separator'
import Image1 from '#/assets/hero-image.png'
import { Button } from '../ui/button'

export function OrderConfirmation() {
  return (
    <div className="bg-[#241612] w-full border-b-10 border-[#D28A4C] max-w-144.5 pt-5.5">
      <div>
        <div className="flex justify-center mb-4">
          <img
            src={ThankYouImage}
            alt="imagem de agradecimento"
            width="80"
            height="80"
          />
        </div>
        <h2 className="text-base leading-4 text-[#CFB28C] font-bold text-center mb-6">
          Seus NFTs agora estão na sua carteira
        </h2>

        <ul className="flex justify-between items-center border-y border-[#D28A4C] pt-[10.5px] pb-[15.5px] px-9 mb-5.25">
          <li className="flex flex-col">
            <span className="text-xs leading-4 font-bold text-[#CFB28C]">
              ID da transação
            </span>
            <span className="text-base leading-4 font-normal text-[#CFB28C]">
              0xA91F…E82C
            </span>
          </li>
          <li>
            <Separator
              className="bg-[#D28A4C] w-px h-7.75"
              orientation="vertical"
            />
          </li>
          <li className="flex flex-col">
            <span className="text-xs font-bold  text-[#CFB28C]">Data</span>
            <span className="text-base font-normal leading-4  text-[#CFB28C]">
              29 Jul, 2026
            </span>
          </li>
          <li>
            <Separator
              className="bg-[#D28A4C] w-px h-7.75"
              orientation="vertical"
            />
          </li>
          <li className="flex flex-col">
            <span className="text-xs font-bold  text-[#CFB28C]">Total</span>
            <span className="text-base font-normal leading-4  text-[#CFB28C]">
              26.846 ETH
            </span>
          </li>
          <li>
            <Separator
              className="bg-[#D28A4C] w-px h-7.75"
              orientation="vertical"
            />
          </li>
          <li className="flex flex-col">
            <span className="text-xs font-bold  text-[#CFB28C]">Carteira</span>
            <span className="text-base font-normal leading-4  text-[#CFB28C]">
              MetaMask
            </span>
          </li>
        </ul>

        <div className="px-11">
          <h3 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
            Detalhes da transação
          </h3>
          <div className="flex justify-between border-b-[0.3px] border-[#D28A4C] pb-3 mb-3 w-full">
            <div>
              <span className="text-base font-bold leading-4 text-[#F5F1EB]">
                NFTs
              </span>
            </div>
            <div className="flex gap-12">
              <span className="text-base font-bold leading-4 text-[#F5F1EB]">
                Edições
              </span>
              <span className="text-base font-bold leading-4 text-[#F5F1EB]">
                Subtotal
              </span>
            </div>
          </div>
          <div className="flex gap-16.25 items-center w-full mb-3">
            <div className="flex gap-3  items-center">
              <div>
                <img
                  src={Image1}
                  alt="NFT"
                  width="70"
                  height="70"
                  className="rounded-[8px]"
                />
              </div>
              <div>
                <h3 className="text-base font-bold leading-4 text-[#F5F1EB] mb-1.5">
                  Emerald Ape #042
                </h3>
                <h4 className="text-sm font-normal leading-4 text-[#B39463]">
                  ID do token: #0042
                </h4>
              </div>
            </div>
            <div className="flex gap-12 items-center">
              <span className="text-sm font-normal leading-4 text-[#CFB28C]">
                (x 2)
              </span>
              <span className="text-[18px] font-bold leading-4 text-[#E89B55] text-right">
                2.38 ETH
              </span>
            </div>
          </div>
          <ul className="flex flex-col items-end justify-end border-b-[0.3px] border-[#D28A4C] pb-3 mb-3 ">
            <li className="flex gap-28.5 items-center mb-3">
              <span className="text-base font-normal leading-4 text-[#F5F1EB]">
                Taxa de rede
              </span>
              <span className="text-[18px] font-normal leading-4 text-[#F5F1EB] text-right">
                0.016 ETH
              </span>
            </li>
            <li className="flex gap-40.75 items-center ">
              <span className="text-base font-bold leading-4 text-[#F5F1EB] ">
                Total
              </span>
              <span className="text-[18px] font-bold leading-4 text-[#E89B55] text-right">
                26.846 ETH
              </span>
            </li>
          </ul>
          <p className="text-sm font-normal leading-5.5 text-[#CFB28C] text-center mb-5">
            Transação confirmada na Ethereum. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </p>
          <div className="flex justify-center items-center mb-12">
            <Button className="w-46.5 max-w-full h-12 border-md flex justify-center items-center bg-[#D28A4C] text-[#140D0A] text-base font-bold leading-4">
              Ver no Etherscan
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
