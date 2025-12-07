import Link from "next/link"

export default function CategoryGrid() {
  const categories = [
    {
      name: "Sala",
      slug: "living",
      image: "/modern-minimalist-living-room-with-sofa-and-scandi.jpg",
    },
    {
      name: "Cocina",
      slug: "cocina",
      image: "/scandinavian-dining-room-with-wooden-table-and-min.jpg",
    },
    {
      name: "Dormitorio",
      slug: "dormitorio",
      image: "/minimalist-white-bedroom-with-bed-frame-and-natura.jpg",
    },
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-light tracking-tight text-charcoal mb-16 text-center">Compra por Habitación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`}>
              <div className="group relative h-96 overflow-hidden rounded-lg cursor-pointer">
                {/* Image */}
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-light text-white tracking-tight">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
