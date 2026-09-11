import { Button } from './ui/button'
import HeroImage from '#/assets/hero-image.png'

export function Hero() {
  return (
    <section className="w-full flex items-center justify-between mb-24 max-w-300 m-auto pt-8">
      <div className="pl-10">
        <p className="font-medium text-sm text-[#F5F1EB]">Bem-vindo à Kurio</p>
        <h1 className="text-[43px] font-bold leading-17.5 text-[#F5F1EB] max-w-137.5 w-full mb-1">
          SEJA DONO DO FUTURO DA ARTE DIGITAL
        </h1>
        <p className="font-regular text-sm leading-6 text-[#CFB28C] w-full max-w-139.25 mb-8">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>
        <Button className="w-full max-w-35 h-10 rounded-md flex justify-center items-center bg-[#D28A4C] text-[#140D0A] font-bold text-base mb-11">
          Explorar
        </Button>

        <div className="flex gap-2 justify-end  items-center">
          <span className="w-2 h-2 bg-[#D28A4C] rounded-full"></span>
          <span className="w-2 h-2 bg-[#D28A4C] rounded-full"></span>
          <span className="w-2 h-2 bg-[#D28A4C] rounded-full"></span>
        </div>
      </div>
      <div>
        <img
          src={HeroImage}
          alt="Imagem da hero"
          width="450"
          height="450"
          className="rounded-3xl"
        />
      </div>
    </section>
  )
}
