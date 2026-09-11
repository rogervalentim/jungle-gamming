import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import Image1 from '#/assets/hero-image.png'
import Minus from '#/assets/icons/minus-icon.svg'
import Plus from '#/assets/icons/plus-icon.svg'
import Trash from '#/assets/icons/delete.svg'

export function ShoppingCart() {
    return (
         <section className="flex justify-between mb-24">
          <div className="w-full max-w-[782px]">
            <div className="flex gap-[61.25px] items-center pb-3 mb-3 border-b-[0.3px] border-[#D28A4C]">
              <span className="text-base text-[#F5F1EB] font-bold w-full max-w-[250px]">
                NFTs
              </span>

              <div className="flex gap-[89.25px] items-center">
                <span className="text-base text-[#F5F1EB] font-bold">
                  Preço
                </span>
                <span className="text-base text-[#F5F1EB] font-bold">
                  Edições
                </span>
                <span className="text-base text-[#F5F1EB] font-bold">
                  Total
                </span>
              </div>
            </div>
            <Card className="p-0 ring-0 bg-[#241612]">
              <CardContent className=" p-0  pr-6 flex gap-[61.25px] w-full items-center flex-row">
                <div className="flex gap-4 items-center">
                  <img
                    src={Image1}
                    alt="produto no carrinho imagem"
                    width="70"
                    height="70"
                    className="rounded-md"
                  />
                  <div className="w-full max-w-[154px]">
                    <CardTitle className="text-base font-bold text-[#F5F1EB]">
                      Emerald Ape #042
                    </CardTitle>
                    <CardDescription className="text-sm font-normal leading-4 text-[#B39463]">
                      ID do token: #0042
                    </CardDescription>
                  </div>
                </div>

                <div className="flex gap-[58px] items-center">
                  <span className="text-base leading-4 max-w-[77px]  w-full font-bold text-[#E89B55]">
                    1.19 ETH
                  </span>
                  <div className="flex gap-3 items-center">
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
                  <span className="text-base leading-4 w-full font-bold text-[#E89B55]">
                    2.38 ETH
                  </span>

                  <Button className="p-0">
                    <img src={Trash} alt="icone da lixeira" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="pb-3 mb-6 border-b-[0.3px] border-[#D28A4C]">
              <h3 className="text-[18px] leading-[16px] text-[#F5F1EB]">
                Resumo da carteira
              </h3>
            </div>

            <h4 className="text-sm font-bold leading-4 text-[#F5F1EB] mb-2">
              Código promocional
            </h4>

            <div className="flex border-[#D28A4C] rounded-[3px] border-[0.3px] w-full max-w-[330px] mb-6 overflow-hidden">
              <input
                type="text"
                placeholder="Digite o código promocional..."
                className="flex-1 min-w-0 h-10 px-2 outline-none bg-transparent
               placeholder:text-[#B39463] placeholder:text-xs
               placeholder:font-normal placeholder:leading-4"
              />

              <button className="w-[102px] shrink-0 h-10 bg-[#D28A4C] text-[#140D0A] text-base leading-4">
                Aplicar
              </button>
            </div>

            <ul>
              <li className="flex items-center justify-between mb-3">
                <span className="text-sm font-normal text-[#F5F1EB]">
                  Subtotal
                </span>
                <span className="text-[18px] leading-4 text-[#F5F1EB] font-normal text-right">
                  26.83 ETH
                </span>
              </li>
              <li className="flex items-center justify-between mb-3">
                <span className="text-sm font-normal text-[#F5F1EB]">
                  Desconto do lançamento
                </span>
                <span className="text-[18px] leading-4 text-[#F5F1EB] font-normal text-right">
                  (-) 00.00
                </span>
              </li>
              <li className="flex items-center justify-between mb-[14px]">
                <span className="text-sm font-normal text-[#F5F1EB]">
                  Taxa de rede
                </span>
                <span className="text-[18px] leading-4 text-[#F5F1EB] font-normal text-right">
                  0.016 ETH
                </span>
              </li>
              <li className="flex justify-end mb-6">
                <span className="text-sm font-normal leading-4 text-[#E89B55]">
                  Taxa estimada
                </span>
              </li>
              <li className="flex items-center justify-between mb-6">
                <span className="text-base font-bold leading-4 text-[#F5F1EB]">
                  Total
                </span>
                <span className="text-[18px] leading-4 font-bold text-right text-[#E89B55]">
                  26.846 ETH
                </span>
              </li>
            </ul>

            <div className="flex flex-col justify-center items-center">
              <Button className="w-full h-10 max-w-[332px] bg-[#D28A4C] flex items-center justify-center mb-3 text-base leading-4 font-bold text-[#140D0A]">
                Conectar e finalizar
              </Button>
              <a href="#" className="text-base text-[#E89B55]">
                Continuar explorando
              </a>
            </div>
          </div>
        </section>
    )
}