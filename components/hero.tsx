import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] bg-beige overflow-hidden pt-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/modern-scandinavian-living-room-with-minimalist-fu.jpg')`,
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6 text-balance">
          Elevá Tu Espacio
        </h1>

        <Link href="#featured-products">
          <Button
            size="lg"
            className="bg-white text-charcoal hover:bg-white/90 font-semibold px-8 py-3 text-base rounded-full"
          >
            Ver Colección
          </Button>
        </Link>
      </div>
    </section>
  )
}
