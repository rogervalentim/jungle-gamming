import type { CardBlogProps } from '#/types'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import ArrowRight from '#/assets/icons/arrow-right-orange.svg'

export function CardBlog({
  image,
  duration,
  date,
  title,
  description,
}: CardBlogProps) {
  return (
    <Card className="p-0 w-full max-w-67 gap-0 ring-0 rounded-[8px]">
      <img src={image} alt={title} width="268" height="195" />
      <CardContent className="p-0 bg-[#241612] pt-3 pb-4 px-4">
        <span className="text-sm leading-4 text-[#CFB28C] mb-2">
          {date} | {duration}
        </span>
        <CardTitle className="font-bold text-base text-[#F5F1EB] mb-2">
          {title}
        </CardTitle>
        <CardDescription className="font-medium text-sm leading-4 text-[#CFB28C] mb-2 line-clamp-2">
          {description}
        </CardDescription>
        <Button
          variant="ghost"
          className="p-0 text-sm leading-3.5 text-[#E89B55] bg-red-400 h-0 font-bold flex justify-center items-center"
        >
          Ler mais
          <span>
            <img src={ArrowRight} alt="seta direita laranja" />
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}
