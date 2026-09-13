import { Collection } from '#/components/collection'
import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/criadores')({
  component: CriadoresComponent,
})

function CriadoresComponent() {
  return (
    <>
      <Navbar />
      <main className="m-auto w-full max-w-300">
        <div className="pt-8">
          <Collection />
        </div>
      </main>
      <Footer />
    </>
  )
}
