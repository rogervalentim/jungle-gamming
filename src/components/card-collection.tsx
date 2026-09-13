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
    <Card className="ring-0 flex p-0 gap-0 w-full max-w-146.5 rounded-[8px] flex-row bg-[#241612] max-[600px]:max-w-none max-[600px]:min-w-0 max-[600px]:overflow-hidden">
      <img
        src={image}
        alt={title}
        width="292"
        height="250"
        className="rounded-[18px] max-[600px]:min-h-[170px] max-[600px]:h-auto max-[600px]:w-[42%] max-[600px]:rounded-l-2xl max-[600px]:rounded-r-none max-[600px]:object-cover"
      />
      <CardContent className="p-0 pt-9.25 pr-8 max-[600px]:flex max-[600px]:w-[58%] max-[600px]:flex-col max-[600px]:justify-center max-[600px]:px-3.5 max-[600px]:py-[18px]">
        <CardTitle className="text-[18px] leading-6 text-right font-bold text-[#F5F1EB] mb-3 max-[600px]:text-left max-[600px]:text-[15px] max-[600px]:leading-[1.35]">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 font-normal text-[#CFB28C] text-right max-[600px]:text-left max-[600px]:text-xs max-[600px]:leading-[1.45]">
          {description}
        </CardDescription>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              location.href = '/#explorar'
            }}
            className="w-full max-w-35 h-10 bg-[#D28A4C] rounded-md flex items-center justify-center text-sm font-medium text-[#140D0A] leading-5 max-[600px]:mt-3 max-[600px]:min-h-9"
          >
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
