"use client"

import { useState, use } from "react"
import { MessageCircle, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/contexts/cart-context"
import { productDetails, products } from "@/lib/products-data"

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = productDetails[slug]
  const productData = products.find((p) => p.slug === slug)
  const [quantity, setQuantity] = useState(1)
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)
  const { addToCart } = useCart()

  if (!product) {
    return (
      <main className="bg-white">
        <Header />
        <div className="h-[600px] flex flex-col items-center justify-center px-6 pt-32">
          <h1 className="text-3xl font-light text-charcoal mb-4">Producto no encontrado</h1>
          <Link href="/">
            <Button className="bg-charcoal text-white hover:bg-charcoal/90 rounded-full px-8">Volver al Inicio</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const handleAddToCart = () => {
    if (productData) {
      addToCart(
        {
          id: productData.slug,
          name: product.title,
          price: product.price,
          cashPrice: productData.cashPrice,
          image: product.images[0] || productData.image,
          slug: productData.slug,
        },
        quantity,
      )
      setShowAddedFeedback(true)
      setTimeout(() => setShowAddedFeedback(false), 2000)
    }
  }

  const whatsappConsultLink = `https://wa.me/541127649873?text=${encodeURIComponent(
    `Hola! Me interesa consultar sobre: ${product.whatsappMessage}`,
  )}`

  return (
    <main className="bg-white">
      <Header />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <button className="flex items-center gap-2 text-charcoal hover:text-charcoal/70 transition mb-8">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver</span>
            </button>
          </Link>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden h-96 lg:h-full lg:min-h-[600px]">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-light tracking-tight text-charcoal mb-4">{product.title}</h1>
                {(() => {
                  const isLastUnits = (productData as any)?.isLastUnits
                  
                  // Caso: Producto con cashPrice y isLastUnits
                  if (productData?.cashPrice && isLastUnits) {
                    return (
                      <div className="space-y-2">
                        <p className="text-2xl font-light text-gray-400 line-through">{product.price}</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-bold text-stone-900">{productData.cashPrice}</p>
                          <span className="text-green-700 text-sm font-medium">Últimas Unidades</span>
                        </div>
                      </div>
                    )
                  }
                  
                  // Caso: Producto sin cashPrice pero con isLastUnits
                  if (isLastUnits && !productData?.cashPrice) {
                    // Calcular precio anterior (aproximadamente 20% más alto)
                    const calculatePreviousPrice = (currentPrice: string): string => {
                      // Extraer el número del precio (remover $ y puntos)
                      const numericValue = parseFloat(currentPrice.replace(/[$.]/g, "").replace(",", "."))
                      if (isNaN(numericValue)) return currentPrice
                      
                      // Calcular precio anterior (20% más alto)
                      const previousValue = numericValue * 1.2
                      
                      // Formatear de vuelta al formato original
                      const formatted = Math.round(previousValue).toLocaleString("es-AR").replace(/,/g, ".")
                      return `$${formatted}`
                    }
                    
                    const previousPrice = calculatePreviousPrice(product.price)
                    
                    return (
                      <div className="space-y-2">
                        <p className="text-2xl font-light text-gray-400 line-through">{previousPrice}</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-bold text-stone-900">{product.price}</p>
                          <span className="text-green-700 text-sm font-medium">Últimas Unidades</span>
                        </div>
                      </div>
                    )
                  }
                  
                  // Caso: Producto con cashPrice (sin isLastUnits)
                  if (productData?.cashPrice) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-light text-gray-600">{product.price}</p>
                          <span className="text-gray-500 text-sm">Tarjeta de Credito/Debito</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-bold text-stone-900">{productData.cashPrice}</p>
                          <span className="text-green-700 text-sm font-medium">15% OFF con Transferencia o Efectivo</span>
                        </div>
                      </div>
                    )
                  }
                  
                  // Caso por defecto: Producto sin cashPrice ni isLastUnits
                  return (
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-light text-gray-600">{product.price}</p>
                      <span className="text-gray-500 text-sm">Tarjeta de Credito/Debito</span>
                    </div>
                  )
                })()}
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-light-gray border-b pt-8 pb-8">
                <p className="text-gray-700 font-light leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-charcoal">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition font-light"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 h-12 text-center border border-light-gray rounded-lg font-light"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition font-light"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-stone-900 text-white rounded-full py-3 text-base font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 relative"
                >
                  {showAddedFeedback ? (
                    <>
                      <Check size={20} />
                      <span>Agregado</span>
                    </>
                  ) : (
                    <span>Agregar al Carrito</span>
                  )}
                </button>
                <a
                  href={whatsappConsultLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-200 bg-transparent text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-500 font-light">
                <p>✓ Envío disponible a nivel nacional</p>
                <p>✓ Garantía de 2 años en todos los productos</p>
                <p>✓ Devolución de 30 días garantizada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
