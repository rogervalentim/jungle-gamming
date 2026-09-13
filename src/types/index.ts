export interface NFT {
  id?: number
  name: string
  image: string
  price: number | string
  currency: string
}

export interface CollectionProps {
  id?: number
  title: string
  description: string
  explore: string
  image: string
}

export interface CardBlogProps {
  id?: number
  image: string
  date: string
  duration: string
  title: string
  description: string
}

type BreadcrumbItem = {
  label: string
  href?: string
}

export interface CustomBreadcrumbProps {
  items: BreadcrumbItem[]
}
