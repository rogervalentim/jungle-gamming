import { CardNft } from '../card-nft'
import Image1 from '#/assets/hero-image.png'
import Image2 from '#/assets/card-feature.png'
import Image3 from '#/assets/image-3.png'
import Image4 from '#/assets/image-4.png'

export function NftCategory() {
  return (
    <section className="w-full mb-24">
      <div className="flex items-center justify-between mb-8 w-full">
        <div>
          <ul className="flex items-center gap-5">
            <li>
              <a href="#" className="text-base font-medium text-[#F5F1EB]">
                Todos os NFTs
              </a>
            </li>
            <li>
              <a href="#" className="text-base font-medium text-[#F5F1EB]">
                Novos lançamentos
              </a>
            </li>
            <li>
              <a href="#" className="text-base font-medium text-[#F5F1EB]">
                Em alta
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-base font-normal text-[#F5F1EB]">
            Ordenar por: Listados recentemente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8.5">
        <CardNft
          name="Emerald Ape #042"
          price={1.19}
          currency="ETH"
          image={Image1}
        />

        <CardNft
          name="Sage Nomad #009"
          price={1.69}
          currency="ETH"
          image={Image2}
        />

        <CardNft
          name="Neon Vessel #552"
          price={1.99}
          currency="ETH"
          image={Image3}
        />

        <CardNft
          name="Emerald Ape #042"
          price={1.19}
          currency="ETH"
          image={Image1}
        />

        <CardNft
          name="Sage Nomad #009"
          price={1.69}
          currency="ETH"
          image={Image2}
        />

        <CardNft
          name="Neon Vessel #552"
          price={1.99}
          currency="ETH"
          image={Image3}
        />

        <CardNft
          name="Emerald Ape #042"
          price={1.19}
          currency="ETH"
          image={Image4}
        />

        <CardNft
          name="Sage Nomad #009"
          price={1.69}
          currency="ETH"
          image={Image4}
        />

        <CardNft
          name="Neon Vessel #552"
          price={1.99}
          currency="ETH"
          image={Image4}
        />
      </div>
    </section>
  )
}
