import { Card } from '../ui/card'

export function NftGallery({ image, name }: { image: string; name: string }) {
  return (
    <section className="flex gap-7 w-full max-w-[50%]">
      <aside>
        <img
          src={image}
          alt={name}
          width="100"
          height="100"
          className="rounded-lg mb-4"
        />
        <img
          src={image}
          alt={name}
          width="100"
          height="100"
          className="rounded-lg mb-4"
        />
        <img
          src={image}
          alt={name}
          width="100"
          height="100"
          className="rounded-lg mb-4"
        />
        <img
          src={image}
          alt={name}
          width="100"
          height="100"
          className="rounded-lg"
        />
      </aside>
      <Card className="bg-[#241612] p-0 rounded-md flex justify-center items-center ring-0 w-full max-w-111 max-h-112">
        <img
          src={image}
          alt={name}
          width="404"
          height="404"
          className="rounded-3xl"
        />
      </Card>
    </section>
  )
}
