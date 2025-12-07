"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CartDropdown } from "@/components/cart-dropdown"
import { useCart } from "@/contexts/cart-context"
import { products } from "@/lib/products-data"

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function Header() {
  const [isSticky, setIsSticky] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const { getTotalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    if (isDropdownOpen || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen, isCartOpen])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    const normalizedQuery = normalizeString(searchQuery)
    return products
      .filter(
        (p) =>
          normalizeString(p.name).includes(normalizedQuery) ||
          normalizeString(p.slug).includes(normalizedQuery),
      )
      .slice(0, 5) // Limitar a 5 resultados
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsDropdownOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsDropdownOpen(e.target.value.trim().length > 0)
  }

  const handleProductClick = () => {
    setSearchQuery("")
    setIsDropdownOpen(false)
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <header
          className={`transition-all duration-300 ${
            isSticky ? "bg-white shadow-sm" : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-tight text-charcoal">
              Nordic Home
            </Link>

            {/* Nav Links - Centered */}
            <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="text-sm font-medium text-charcoal hover:text-charcoal/70 transition">
                Inicio
              </Link>
              <Link href="/living" className="text-sm font-medium text-charcoal hover:text-charcoal/70 transition">
                Sala
              </Link>
              <Link href="/cocina" className="text-sm font-medium text-charcoal hover:text-charcoal/70 transition">
                Cocina
              </Link>
              <Link href="/dormitorio" className="text-sm font-medium text-charcoal hover:text-charcoal/70 transition">
                Dormitorio
              </Link>
              <Link href="/contacto" className="text-sm font-medium text-charcoal hover:text-charcoal/70 transition">
                Contacto
              </Link>
            </nav>

            {/* Search Bar & Cart */}
            <div className="hidden md:flex items-center gap-4">
              <form onSubmit={handleSearch}>
                <div className="relative" ref={searchRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                    placeholder="Buscar..."
                    className="w-64 bg-stone-100 rounded-full py-2 pl-4 pr-10 text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <Search size={18} />
                  </button>

                  {/* Dropdown Results */}
                  {isDropdownOpen && filteredProducts.length > 0 && (
                    <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-lg shadow-xl border border-stone-200 z-50 max-h-96 overflow-y-auto">
                      <div className="py-2">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.slug}
                            href={`/producto/${product.slug}`}
                            onClick={handleProductClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-charcoal truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {(product as any).cashPrice || product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>

              {/* Cart Icon - Centered in remaining space */}
              <div className="flex-1 flex justify-end pr-6 relative" ref={cartRef}>
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative text-charcoal hover:text-charcoal/70 transition-colors cursor-pointer"
                >
                  <ShoppingCart size={24} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              </div>
            </div>

            {/* Mobile Search Icon */}
            <button className="md:hidden text-charcoal">
              <Search size={20} />
            </button>
          </div>
        </header>
      </div>
    </>
  )
}

export default Header
