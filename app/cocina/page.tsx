"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ProductPrice } from "@/components/product-price"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryToolbar } from "@/components/category-toolbar"
import { FilterState } from "@/components/filter-panel"
import { products } from "@/lib/products-data"

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

const initialFilters: FilterState = {
  disponibilidad: { inmediata: false, encargo: false },
  precioMin: "",
  precioMax: "",
  tipoMueble: [],
  tamanoSofa: [],
  materialTela: [],
  formaMesa: [],
  material: [],
  medidaCama: [],
  funcionalidad: [],
}

export default function CocinaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("default")
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const kitchenProducts = useMemo(() => {
    let filtered = products.filter((p) => p.category === "cocina")

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeString(searchQuery)
      filtered = filtered.filter(
        (p) =>
          normalizeString(p.name).includes(normalizedQuery) ||
          normalizeString(p.slug).includes(normalizedQuery),
      )
    }

    // Filtrar por precio
    if (filters.precioMin) {
      const minPrice = parseFloat(filters.precioMin)
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.price.replace(/[$.]/g, ""))
        return price >= minPrice
      })
    }
    if (filters.precioMax) {
      const maxPrice = parseFloat(filters.precioMax)
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.price.replace(/[$.]/g, ""))
        return price <= maxPrice
      })
    }

    // Ordenar
    if (sortOption === "default") {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      if (sortOption === "price-asc" || sortOption === "price-desc") {
        // Extraer números del precio (remover $ y puntos)
        const priceA = parseFloat(a.price.replace(/[$.]/g, ""))
        const priceB = parseFloat(b.price.replace(/[$.]/g, ""))
        return sortOption === "price-asc" ? priceA - priceB : priceB - priceA
      }

      if (sortOption === "name-asc" || sortOption === "name-desc") {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        if (sortOption === "name-asc") {
          return nameA.localeCompare(nameB, "es")
        } else {
          return nameB.localeCompare(nameA, "es")
        }
      }

      return 0
    })
  }, [searchQuery, sortOption, filters])

  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero Section for Category */}
        <section className="py-16 px-6 bg-off-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-light tracking-tight text-charcoal mb-4">Cocina</h1>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Diseña una cocina moderna y funcional con nuestros muebles y accesorios de alta calidad
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-12 pb-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mt-4 mb-4">
              <Breadcrumbs currentPage="Cocina" />
            </div>
            <CategoryToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={setSortOption}
              filters={filters}
              onFiltersChange={setFilters}
            />
            {kitchenProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-500 text-lg">No se encontraron productos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {kitchenProducts.map((product) => (
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
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
