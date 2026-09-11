import type { NFT } from '#/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export function CardNft({ name, price, currency, image }: NFT) {
  return (
    <Card className="max-w-64.5 p-0 gap-0 rounded-none w-full ring-0">
      <CardHeader className="bg-[#241612] rounded-none py-6.5 px-1 mb-3">
        <img
          src={image}
          alt={name}
          width="250"
          height="250"
          className="rounded-[16px]"
        />
      </CardHeader>
      <CardContent className="p-0">
        <CardTitle className="text-base leading-4 p-0 font-normal text-[#F5F1EB] mb-3">
          {name}
        </CardTitle>
        <CardDescription className="text-[18px] font-bold leading-4 text-[#E89B55]">
          {price} {currency}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
