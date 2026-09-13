import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import ImageFeature from '#/assets/card-feature.webp'

export function CardFeature() {
  return (
    <Card className="rounded-none ring-0 p-0 max-w-77.5 w-full bg-[linear-gradient(180deg,rgba(210,138,76,0.1)_0%,rgba(210,138,76,0.03)_100%)]">
      <CardHeader className="px-5 pt-6.5 pb-4">
        <CardTitle className="text-[24px] font-bold leading-8 text-[#E89B55] mb-4">
          NFT EM DESTAQUE
        </CardTitle>
        <CardDescription className="text-[22px] leading-4 font-bold text-[#F5F1EB] text-center">
          OFERTA LIMITADA
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <img
          src={ImageFeature}
          alt="NFT em destaque da coleção Kurio"
          width="310"
          height="368"
          className="rounded-[22px]"
        />
      </CardContent>
    </Card>
  )
}
