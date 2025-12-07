"use client"

import Link from "next/link"
import { products } from "@/lib/products-data"
import { ProductPrice } from "@/components/product-price"

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 4)

  return (
    <section id="featured-products" className="py-24 px-6 bg-light-gray">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-light tracking-tight text-charcoal mb-4 text-center">Productos Destacados</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
          Selecciones curadas de nuestra colección de diseño escandinavo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {featuredProducts.map((product) => (
            <Link key={product.slug} href={`/producto/${product.slug}`}>
              <div className="group cursor-pointer p-4 rounded-lg hover:bg-stone-50 transition-colors duration-200">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg mb-6 h-80">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:shadow-lg transition-shadow duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-charcoal">{product.name}</h3>
                  <ProductPrice
                    price={product.price}
                    cashPrice={(product as any).cashPrice}
                    priceLabel={(product as any).priceLabel}
                    isLastUnits={(product as any).isLastUnits}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
