"use client"

import { useRef, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const formatPrice = (price: number): string => {
    return `$${Math.round(price).toLocaleString("es-AR").replace(/,/g, ".")}`
  }

  const generateWhatsAppMessage = (): string => {
    let message = "Hola Nordic Home! Quiero realizar el siguiente pedido:\n\n"
    cartItems.forEach((item) => {
      const price = item.cashPrice || item.price
      message += `${item.quantity}x ${item.name} (${price})\n`
    })
    const total = formatPrice(getCartTotal())
    message += `\nTotal: ${total}`
    return message
  }

  const handleCheckout = () => {
    const whatsappNumber = "541127649873"
    const message = generateWhatsAppMessage()
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank")
    onClose()
  }

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-4 w-96 bg-white rounded-xl shadow-xl border border-stone-100 z-50"
    >
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">Carrito</h3>
        <div className="flex items-center gap-3">
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-stone-500 text-xs hover:text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={14} />
              Vaciar Carrito
            </button>
          )}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-stone-500 text-sm">Tu carrito está vacío</p>
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0">
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={onClose}
                    className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-charcoal truncate">{item.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {(item.cashPrice || item.price)} x {item.quantity}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors text-xs cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-xs text-stone-600 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-stone-600 transition-colors mt-1 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-charcoal">Total:</span>
              <span className="text-lg font-bold text-charcoal">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <Link
              href="/carrito"
              onClick={onClose}
              className="block w-full bg-stone-900 text-white py-3 rounded-full font-semibold hover:bg-stone-800 transition-colors text-center text-sm cursor-pointer"
            >
              Ver Carrito
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default CartDropdown

