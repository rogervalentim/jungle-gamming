import HeroImage from '#/assets/hero-image.png'
import { Button } from '../ui/button'

export function Hero() {
  return (
    <section className="relative mx-auto mb-24 min-h-48 w-full max-w-300 overflow-hidden rounded-3xl bg-[#38261B] px-5 py-3 text-[#F5F1EB] md:min-h-72 md:px-8 md:py-6 lg:flex lg:min-h-0 lg:items-center lg:justify-between lg:overflow-visible lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-8">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#765237]/35 md:h-96 md:w-96 lg:hidden" />

      <div className="relative z-10 max-w-[55%] md:max-w-[58%] lg:max-w-none lg:pl-10">
        <p className="mb-1 text-xs font-medium md:text-sm">Bem-vindo à Kurio</p>

        <h1 className="mb-2 text-base font-bold leading-7 md:text-2xl md:leading-10 lg:mb-1 lg:max-w-137.5 lg:text-[43px] lg:leading-17.5">
          <span className="lg:hidden">SEJA DONO DA CULTURA DIGITAL</span>
          <span className="hidden lg:inline">
            SEJA DONO DO FUTURO DA ARTE DIGITAL
          </span>
        </h1>

        <p className="text-xs leading-4 text-[#CFB28C] md:text-base md:leading-6 lg:mb-8 lg:max-w-139.25 lg:text-sm">
          <span className="lg:hidden">
            Descubra NFTs selecionados de criadores do mundo todo.
          </span>
          <span className="hidden lg:inline">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </span>
        </p>

        <a
          href="#explorar"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#D28A4C] md:text-base lg:hidden"
        >
          EXPLORAR <span aria-hidden="true">→</span>
        </a>

        <Button className="mb-11 hidden h-10 w-full max-w-35 items-center justify-center rounded-md bg-[#D28A4C] text-base font-bold text-[#140D0A] lg:flex">
          Explorar
        </Button>

        <div
          className="hidden items-center justify-end gap-2 lg:flex"
          aria-hidden="true"
        >
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2 w-2 rounded-full bg-[#D28A4C]" />
          ))}
        </div>
      </div>

      <img
        src={HeroImage}
        alt="Arte digital em destaque"
        className="absolute right-4 top-4 h-34 w-34 rounded-2xl object-cover md:right-6 md:top-6 md:h-56 md:w-56 lg:static lg:h-112.5 lg:w-112.5 lg:rounded-3xl"
      />

      <div
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden"
        aria-hidden="true"
      >
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]" />
        ))}
      </div>
    </section>
  )
}
