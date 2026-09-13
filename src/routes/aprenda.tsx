import { Blog } from '#/components/blog/blog'
import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/aprenda')({
  component: AprendaRouteComponent,
})

function AprendaRouteComponent() {
  return (
    <>
      <Navbar />
      <main className="m-auto w-full max-w-300">
        <div className="pt-8">
          <Blog />
        </div>
      </main>
      <Footer />
    </>
  )
}
