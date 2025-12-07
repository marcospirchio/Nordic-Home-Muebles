"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { products } from "@/lib/products-data"
import { ProductPrice } from "@/components/product-price"

export default function ShopTheLook() {
  const shopProducts = products.slice(0, 3)

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-light tracking-tight text-charcoal mb-16 text-center">Comprá este Estilo</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Image */}
          <div className="rounded-lg overflow-hidden h-96 lg:h-auto">
            <img
              src="/scandinavian-minimalist-living-room-interior-desig.jpg"
              alt="Compra el Estilo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Products List */}
          <div className="flex flex-col justify-center space-y-8">
            {shopProducts.map((product) => (
              <div
                key={product.slug}
                className="space-y-4 pb-8 border-b border-light-gray last:border-0 p-4 rounded-lg hover:bg-stone-50 transition-colors duration-200"
              >
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-1">{product.name}</h3>
                  <ProductPrice
                    price={product.price}
                    cashPrice={(product as any).cashPrice}
                    priceLabel={(product as any).priceLabel}
                    isLastUnits={(product as any).isLastUnits}
                  />
                </div>
                <Link href={`/producto/${product.slug}`}>
                  <Button
                    className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition rounded-full bg-transparent"
                    variant="outline"
                  >
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
