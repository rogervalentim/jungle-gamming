import { CardCollection } from './card-collection'
import ImageCollection1 from '#/assets/hero-image.webp'
import ImageCollection2 from '#/assets/image-3.webp'

export function Collection() {
  return (
    <section
      id="colecoes"
      className="flex gap-7 w-full max-w-300 m-auto mb-24 max-[600px]:max-w-none max-[600px]:flex-col max-[600px]:gap-4 max-[600px]:mb-10"
    >
      <CardCollection
        id={1}
        title="Lançamentos gênesis de edição limitada"
        description="Colecione edições escassas diretamente dos criadores antes da revelação pública."
        explore="Explorar"
        image={ImageCollection1}
      />
      <CardCollection
        id={2}
        title="Arte digital selecionada e muito mais"
        description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura."
        explore="Explorar"
        image={ImageCollection2}
      />
    </section>
  )
}
