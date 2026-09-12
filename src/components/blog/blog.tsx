import { CardBlog } from './card-blog'
import ImageBlog1 from '#/assets/image-3.png'
import ImageBlog2 from '#/assets/hero-image.png'
import ImageBlog3 from '#/assets/card-feature.png'
import ImageBlog4 from '#/assets/image-4.png'

export function Blog() {
  return (
    <section className="w-full max-w-300 m-auto mb-24">
      <h1 className="text-[28px] font-bold text-center text-[#F5F1EB] mb-3">
        Diário da Cunhagem
      </h1>
      <p className="text-sm font-normal text-center text-[#CFB28C] mb-10">
        Histórias, guias e insights para colecionadores sobre o universo da
        propriedade digital.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4">
        <CardBlog
          date="12 de setembro"
          duration="Leitura de 6 min"
          title="Como funciona a propriedade de NFTs"
          description="Aprenda a colecionar, negociar e verificar ativos digitais."
          image={ImageBlog1}
        />
        <CardBlog
          date="13 de setembro"
          duration="Leitura de 2 min"
          title="10 artistas digitais para acompanhar"
          description="Conheça criadores que moldam a cultura digital."
          image={ImageBlog2}
        />
        <CardBlog
          date="15 de setembro "
          duration="Leitura de 3 min"
          title="Raridade, atributos e procedência"
          description="Entenda raridade, procedência, direitos autorais e utilidade."
          image={ImageBlog3}
        />
        <CardBlog
          date="13 de setembro "
          duration="Leitura de 2 min"
          title="Como proteger sua carteira"
          description="Proteja sua carteira, seus ativos e sua identidade."
          image={ImageBlog4}
        />
      </div>
    </section>
  )
}
