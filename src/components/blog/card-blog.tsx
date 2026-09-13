import type { CardBlogProps } from '#/types'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import ArrowRight from '#/assets/icons/arrow-right-orange.svg'
import { useState } from 'react'

export function CardBlog({
  image,
  duration,
  date,
  title,
  description,
}: CardBlogProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className="p-0 w-full max-w-67 gap-0 ring-0 rounded-[8px] max-[600px]:max-w-none max-[600px]:min-w-0 max-[600px]:overflow-hidden">
      <img
        className="max-[600px]:aspect-[1.25] max-[600px]:h-auto max-[600px]:w-full max-[600px]:object-cover"
        src={image}
        alt={title}
        width="268"
        height="195"
      />
      <CardContent className="p-0 bg-[#241612] pt-3 pb-4 px-4 max-[600px]:p-2.5">
        <span className="text-sm leading-4 text-[#CFB28C] mb-2 max-[600px]:text-[11px] max-[600px]:leading-[1.35]">
          {date} | {duration}
        </span>
        <CardTitle className="font-bold text-base text-[#F5F1EB] mb-2 max-[600px]:text-[13px] max-[600px]:leading-[1.35]">
          {title}
        </CardTitle>
        <CardDescription
          className={`font-medium text-sm leading-4 text-[#CFB28C] mb-2 max-[600px]:text-[11px] max-[600px]:leading-[1.35] ${expanded ? '' : 'line-clamp-2'}`}
        >
          {description}
        </CardDescription>
        <Button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          variant="ghost"
          className="p-0 text-sm leading-5 text-[#E89B55] bg-transparent h-auto font-bold flex justify-center items-center max-[600px]:min-h-6 max-[600px]:justify-start max-[600px]:bg-transparent"
        >
          {expanded ? 'Mostrar menos' : 'Ler mais'}
          <span>
            <img src={ArrowRight} alt="seta direita laranja" />
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}
