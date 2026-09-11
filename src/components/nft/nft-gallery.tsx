import Image from '#/assets/hero-image.png'
import { Card } from '../ui/card'

export function NftGallery() {
  return (
    <section className="flex gap-7 w-full max-w-[50%]">
      <aside>
        <img
          src={Image}
          alt="imagem da galeria"
          width="100"
          height="100"
          className="rounded-[8px] mb-4"
        />
        <img
          src={Image}
          alt="imagem da galeria"
          width="100"
          height="100"
          className="rounded-[8px] mb-4"
        />
        <img
          src={Image}
          alt="imagem da galeria"
          width="100"
          height="100"
          className="rounded-[8px] mb-4"
        />
        <img
          src={Image}
          alt="imagem da galeria"
          width="100"
          height="100"
          className="rounded-[8px]"
        />
      </aside>
      <Card className="bg-[#241612] p-0 rounded-md flex justify-center items-center ring-0 w-full max-w-111">
        <img
          src={Image}
          alt="imagem principal da galeria"
          width="404"
          height="404"
          className="rounded-[24px]"
        />
      </Card>
    </section>
  )
}
