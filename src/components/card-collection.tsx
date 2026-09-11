import type { CollectionProps } from '#/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import ArrowRight from '#/assets/icons/arrow-right.svg'

export function CardCollection({
  title,
  description,
  explore,
  image,
}: CollectionProps) {
  return (
    <Card className="ring-0 flex p-0 gap-0 w-full max-w-146.5 rounded-[8px] flex-row bg-[#241612]">
      <img
        src={image}
        alt={title}
        width="292"
        height="250"
        className="rounded-[18px]"
      />
      <CardContent className="p-0 pt-9.25 pr-8 ">
        <CardTitle className="text-[18px] leading-6 text-right font-bold text-[#F5F1EB] mb-3">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 font-normal text-[#CFB28C] text-right">
          {description}
        </CardDescription>
        <div className="flex justify-end">
          <Button className="w-full max-w-35 h-10 bg-[#D28A4C] rounded-md flex items-center justify-center text-sm font-medium text-[#140D0A] leading-5">
            {explore}
            <span>
              <img
                src={ArrowRight}
                alt="icone seta direita"
                width="9"
                height="12"
              />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
