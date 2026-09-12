import { Button } from '../ui/button'
// import { Slider } from '../ui/slider'

export function FilterSidebar() {
  return (
    <aside className="p-5 bg-[#241612] w-full max-w-77.5 mb-6">
      <h3 className="text-[18px] leading-4 font-bold text-[#F5F1EB] mb-3">
        Coleções
      </h3>

      <ul className="mb-10">
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#E89B55]"
          >
            Arte digital <span>(33)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Fotografia <span>(12)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Música <span>(65)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Arte 3D <span>(39)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Colecionáveis <span>(23)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Generativa <span>(17)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Jogos <span>(19)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Assinaturas <span>(13)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Utilidade <span>(18)</span>
          </a>
        </li>
      </ul>

      <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-3">
        Faixa de preço
      </h3>

      {/* <Slider
        defaultValue={[25, 50]}
        max={100}
        step={5}
        className="mx-auto w-full max-w-xs bg-[#D28A4C] mb-3"
      /> */}

      <p className="text-base font-normal text-[#F5F1EB] mb-3">
        Preço: 0,02 - 12,30 ETH
      </p>

      <Button className="w-23 h-9 flex justify-center items-center rounded-md bg-[#D28A4C] text-[#140D0A] text-base font-bold mb-10">
        Aplicar
      </Button>

      <h3 className="text-[18px] leading-4 font-bold text-[#F5F1EB]">Rede</h3>

      <ul>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Ethereum <span>(119)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Polygon <span>(78)</span>
          </a>
        </li>
        <li className="w-full max-w-61.5 px-3">
          <a
            href="#"
            className="flex justify-between items-center text-base leading-10 font-normal text-[#CFB28C]"
          >
            Solana <span>(86)</span>
          </a>
        </li>
      </ul>
    </aside>
  )
}
