import Image1 from '#/assets/card-feature.png'
import Image3 from '#/assets/image-3.png'
import Image4 from '#/assets/image-4.png'
import { CardNft } from './card-nft'

interface MoreCollectionProps {
    title: string
}

export function MoreCollection({title}: MoreCollectionProps) {
    return (
          <section>
          <div className="border-b-[0.3px] border-[#D28A4C] pb-3 mb-8">
            <h4 className="text-[17px] leading-4 font-bold text-[#E89B55]">
              {title}
            </h4>
          </div>
          <div className="grid grid-cols-5 gap-6.5 mb-24">
            <CardNft
              name="Cosmic Bloom #118"
              price={1.29}
              currency="ETH"
              image={Image1}
            />
            <CardNft
              name="Violet Nomad #314"
              price={1.39}
              currency="ETH"
              image={Image1}
            />
            <CardNft
              name="Ivory Baron #088"
              price={1.79}
              currency="ETH"
              image={Image3}
            />
            <CardNft
              name="Golden Beat #207"
              price={0.99}
              currency="ETH"
              image={Image4}
            />
            <CardNft
              name="Golden Signal #160"
              price={0.39}
              currency="ETH"
              image={Image4}
            />
          </div>
        </section>
    )
}