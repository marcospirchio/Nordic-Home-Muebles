"use client"

import { useState } from "react"
import { ShoppingBag, Trash2, Shield, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/contexts/cart-context"

type PaymentMethod = "transferencia" | "efectivo" | "tarjeta"
type DeliveryOption = "envio" | "retiro"
type ShippingMethod = "via-cargo" | "andreani" | "flete-privado"
type Installments = "1" | "3" | "6" | "12"
type CardBrand = "visa" | "mastercard" | "amex" | null

// Card Brand Detection
const detectCardBrand = (cardNumber: string): CardBrand => {
  const cleaned = cardNumber.replace(/\s/g, "")
  
  if (cleaned.startsWith("4")) {
    return "visa"
  }
  if (cleaned.match(/^5[1-5]/) || cleaned.match(/^2[2-7]/)) {
    return "mastercard"
  }
  if (cleaned.startsWith("34") || cleaned.startsWith("37")) {
    return "amex"
  }
  
  return null
}

// Card Brand Icons
const VisaIcon = () => (
  <Image
    src="/64px-Visa_Inc._logo.svg.png"
    alt="Visa"
    width={28}
    height={18}
    className="h-3.5 w-auto object-contain"
  />
)

const MastercardIcon = () => (
  <Image
    src="/64px-Mastercard-logo.svg (1).png"
    alt="Mastercard"
    width={40}
    height={25}
    className="h-5 w-auto object-contain"
  />
)

const AmexIcon = () => (
  <Image
    src="/64px-American_Express_logo_(2018).svg.png"
    alt="American Express"
    width={40}
    height={25}
    className="h-5 w-auto object-contain"
  />
)

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getTotalItems, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia")
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("envio")
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("via-cargo")
  const [installments, setInstallments] = useState<Installments>("1")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
    documentId: "",
  })
  const [expiryError, setExpiryError] = useState("")
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>("")
  const cardBrand = detectCardBrand(formData.cardNumber)

  const validateExpiryDate = (value: string): boolean => {
    if (value.length < 5) return true // Permitir mientras se escribe
    
    const [month, year] = value.split("/")
    if (!month || !year || month.length !== 2 || year.length !== 2) return true
    
    const expiryMonth = parseInt(month, 10)
    const expiryYear = 2000 + parseInt(year, 10) // Convertir AA a AAAA
    
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    // Validar que el mes esté entre 1 y 12
    if (expiryMonth < 1 || expiryMonth > 12) return false
    
    // Validar que no sea anterior a la fecha actual
    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false
    
    return true
  }

  const formatPrice = (price: number): string => {
    return `$${Math.round(price).toLocaleString("es-AR").replace(/,/g, ".")}`
  }

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => {
      const price = item.price
      const numericPrice = parseFloat(price.replace(/[$.]/g, "").replace(",", "."))
      return total + (isNaN(numericPrice) ? 0 : numericPrice * item.quantity)
    }, 0)
  }

  const calculateDiscount = (): number => {
    if (paymentMethod === "transferencia" || paymentMethod === "efectivo") {
      const subtotal = calculateSubtotal()
      return subtotal * 0.15 // 15% discount
    }
    return 0
  }

  const calculateInterest = (): number => {
    if (paymentMethod === "tarjeta" && installments === "12") {
      const subtotal = calculateSubtotal()
      return subtotal * 0.6 // 60% de interés
    }
    return 0
  }

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const interest = calculateInterest()
    return subtotal - discount + interest
  }

  const generateWhatsAppMessage = (): string => {
    let message = "Hola Nordic Home! Quiero realizar el siguiente pedido:\n\n"
    
    // Datos del cliente
    if (formData.name) {
      message += `👤 Cliente: ${formData.name}\n`
    }
    if (formData.email) {
      message += `📧 Email: ${formData.email}\n`
    }
    if (formData.address || formData.city || formData.postalCode) {
      let addressLine = formData.address
      if (formData.city) addressLine += addressLine ? `, ${formData.city}` : formData.city
      if (formData.postalCode) addressLine += addressLine ? `, CP: ${formData.postalCode}` : `CP: ${formData.postalCode}`
      message += `📍 Dirección: ${addressLine}\n`
    }
    
    // Opción de entrega
    if (deliveryOption === "envio") {
      const shippingMethods = {
        "via-cargo": "Via Cargo",
        "andreani": "Andreani",
        "flete-privado": "Flete Privado",
      }
      message += `🚚 Envío: ${shippingMethods[shippingMethod]}\n`
    } else {
      message += `🏪 Retiro en local\n`
    }
    message += "\n"

    // Productos
    message += "📦 Productos:\n"
    cartItems.forEach((item, index) => {
      const price = item.cashPrice || item.price
      message += `${index + 1}. ${item.name} x${item.quantity} - ${price} c/u\n`
    })
    message += "\n"

    // Método de pago
    const paymentMethods = {
      transferencia: "Transferencia (15% OFF)",
      efectivo: "Efectivo contra entrega/retiro en local (15% OFF)",
      tarjeta: "Tarjeta de Crédito/Débito",
    }
    let paymentText = paymentMethods[paymentMethod]
    if (paymentMethod === "tarjeta") {
      if (installments === "1") {
        paymentText += " - 1 pago único"
      } else if (installments === "3") {
        paymentText += " - 3 cuotas sin interés"
      } else if (installments === "6") {
        paymentText += " - 6 cuotas sin interés"
      } else if (installments === "12") {
        paymentText += " - 12 cuotas con interés"
      }
    }
    message += `💳 Método de Pago: ${paymentText}\n\n`

    // Totales
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const interest = calculateInterest()
    const total = calculateTotal()
    
    message += `💰 Resumen:\n`
    message += `Subtotal: ${formatPrice(subtotal)}\n`
    if (discount > 0) {
      message += `Descuento (15%): -${formatPrice(discount)}\n`
    }
    if (interest > 0) {
      message += `Interés (60%): +${formatPrice(interest)}\n`
    }
    message += `Total: ${formatPrice(total)}`

    return message
  }

  const generateOrderNumber = (): string => {
    // Genera un número de orden aleatorio de 8 dígitos
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    
    // Si el pago es con tarjeta, mostrar pantalla de éxito
    if (paymentMethod === "tarjeta") {
      const newOrderNumber = generateOrderNumber()
      setOrderNumber(newOrderNumber)
      setOrderCompleted(true)
      clearCart()
      return
    }
    
    // Para otros métodos de pago, abrir WhatsApp
    const whatsappNumber = "541127649873"
    const message = generateWhatsAppMessage()
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank")
  }

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart()
    }
  }

  // Pantalla de éxito del pedido
  if (orderCompleted) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 px-6 bg-white min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-charcoal">¡Pedido Realizado con Éxito!</h1>
              <p className="text-lg text-stone-600">
                Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
              </p>
              <div className="bg-white rounded-lg p-6 border border-stone-200">
                <p className="text-sm text-stone-500 mb-2">Número de Orden</p>
                <p className="text-3xl font-bold text-charcoal">{orderNumber}</p>
              </div>
              <div className="pt-4 space-y-3">
                <Link
                  href="/"
                  className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors"
                >
                  Volver a la Tienda
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-light tracking-tight text-charcoal">
              Tu Carrito
              {cartItems.length > 0 && (
                <span className="text-stone-500 text-2xl ml-2">
                  ({getTotalItems()} {getTotalItems() === 1 ? "Artículo" : "Artículos"})
                </span>
              )}
            </h1>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-stone-500 text-sm hover:text-stone-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} />
                Vaciar Carrito
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24">
              <ShoppingBag size={64} className="text-stone-300 mb-6" />
              <h2 className="text-2xl font-light text-charcoal mb-4">Tu carrito está vacío</h2>
              <Link
                href="/"
                className="bg-stone-900 text-white px-8 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors"
              >
                Volver a la Tienda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left Column - Cart Items & Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cart Items List */}
                <div className="space-y-0 border border-stone-100 rounded-xl overflow-hidden">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-6 ${
                        index !== cartItems.length - 1 ? "border-b border-stone-100" : ""
                      }`}
                    >
                      {/* Product Image */}
                      <Link
                        href={`/producto/${item.slug}`}
                        className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-charcoal mb-1">{item.name}</h3>
                        <p className="text-sm text-stone-500">
                          {item.cashPrice || item.price}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="text-stone-900 font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-stone-600 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Form */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-charcoal">Detalles de Entrega</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan.perez@ejemplo.com"
                        className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Av. Corrientes 1234"
                        className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="CABA"
                        className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 10)
                          setFormData({ ...formData, postalCode: value })
                        }}
                        placeholder="C1424"
                        maxLength={10}
                        className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Delivery Option */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      Opción de Entrega
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="envio"
                          checked={deliveryOption === "envio"}
                          onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                          className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                        />
                        <div className="flex-1">
                          <span className="text-stone-900 font-medium">Envío</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="retiro"
                          checked={deliveryOption === "retiro"}
                          onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                          className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                        />
                        <div className="flex-1">
                          <span className="text-stone-900 font-medium">Retiro en Local</span>
                        </div>
                      </label>
                    </div>

                    {/* Shipping Method (only if envío is selected) */}
                    {deliveryOption === "envio" && (
                      <div className="ml-7 space-y-3 mt-3">
                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="shipping"
                            value="via-cargo"
                            checked={shippingMethod === "via-cargo"}
                            onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-stone-900 text-sm">Via Cargo</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="shipping"
                            value="andreani"
                            checked={shippingMethod === "andreani"}
                            onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-stone-900 text-sm">Andreani</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="shipping"
                            value="flete-privado"
                            checked={shippingMethod === "flete-privado"}
                            onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-stone-900 text-sm">Flete Privado</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      Método de Pago
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="transferencia"
                          checked={paymentMethod === "transferencia"}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                        />
                        <div className="flex-1">
                          <span className="text-stone-900 font-medium">Transferencia (15% OFF)</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="efectivo"
                          checked={paymentMethod === "efectivo"}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                        />
                        <div className="flex-1">
                          <span className="text-stone-900 font-medium">
                            Efectivo contra entrega/retiro en local (15% OFF)
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="tarjeta"
                          checked={paymentMethod === "tarjeta"}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                        />
                        <div className="flex-1">
                          <span className="text-stone-900 font-medium">Tarjeta de Crédito/Débito</span>
                        </div>
                      </label>
                    </div>

                    {/* Installments (only if tarjeta is selected) */}
                    {paymentMethod === "tarjeta" && (
                      <div className="ml-7 space-y-3 mt-3">
                        <label className="block text-xs font-medium text-stone-600 mb-2">
                          Cuotas
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="installments"
                            value="1"
                            checked={installments === "1"}
                            onChange={(e) => setInstallments(e.target.value as Installments)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-stone-900 text-sm">1 pago único</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="installments"
                            value="3"
                            checked={installments === "3"}
                            onChange={(e) => setInstallments(e.target.value as Installments)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-green-700 text-sm font-medium">3 cuotas sin interés</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="installments"
                            value="6"
                            checked={installments === "6"}
                            onChange={(e) => setInstallments(e.target.value as Installments)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-green-700 text-sm font-medium">6 cuotas sin interés</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="radio"
                            name="installments"
                            value="12"
                            checked={installments === "12"}
                            onChange={(e) => setInstallments(e.target.value as Installments)}
                            className="w-4 h-4 text-stone-900 focus:ring-stone-300"
                          />
                          <span className="text-stone-900 text-sm">12 cuotas con interés</span>
                        </label>
                      </div>
                    )}

                    {/* Card Details (only if tarjeta is selected) */}
                    {paymentMethod === "tarjeta" && (
                      <div className="ml-7 space-y-4 mt-4 pt-4 border-t border-stone-200">
                        <label className="block text-xs font-medium text-stone-600 mb-3">
                          Datos de la Tarjeta
                        </label>
                        
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-2">
                            Número de Tarjeta
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "")
                                // Amex tiene 15 dígitos, otras tarjetas 16
                                const maxLength = value.startsWith("34") || value.startsWith("37") ? 15 : 16
                                const cleaned = value.slice(0, maxLength)
                                const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim()
                                setFormData({ ...formData, cardNumber: formatted })
                              }}
                              placeholder="1234 5678 9012 3456"
                              className="w-full bg-stone-50 rounded-lg px-4 py-3 pr-12 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                            />
                            {cardBrand && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 opacity-100">
                                {cardBrand === "visa" && <VisaIcon />}
                                {cardBrand === "mastercard" && <MastercardIcon />}
                                {cardBrand === "amex" && <AmexIcon />}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-stone-700 mb-2">
                              Vencimiento
                            </label>
                            <input
                              type="text"
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                }
                                const formattedValue = value.slice(0, 5)
                                
                                // Validar fecha
                                if (formattedValue.length === 5) {
                                  const isValid = validateExpiryDate(formattedValue)
                                  if (!isValid) {
                                    setExpiryError("La fecha de vencimiento no puede ser anterior a la fecha actual")
                                  } else {
                                    setExpiryError("")
                                  }
                                } else {
                                  setExpiryError("")
                                }
                                
                                setFormData({ ...formData, cardExpiry: formattedValue })
                              }}
                              placeholder="MM/AA"
                              maxLength={5}
                              className={`w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
                                expiryError ? "border border-red-300 focus:ring-red-300" : "focus:ring-stone-300"
                              }`}
                            />
                            {expiryError && (
                              <p className="text-xs text-red-600 mt-1">{expiryError}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-stone-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={formData.cardCvv}
                              onChange={(e) => {
                                const maxLength = cardBrand === "amex" ? 4 : 3
                                const value = e.target.value.replace(/\D/g, "").slice(0, maxLength)
                                setFormData({ ...formData, cardCvv: value })
                              }}
                              placeholder={cardBrand === "amex" ? "1234" : "123"}
                              maxLength={cardBrand === "amex" ? 4 : 3}
                              className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-2">
                            Nombre del Titular
                          </label>
                          <input
                            type="text"
                            value={formData.cardholderName}
                            onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                            placeholder="Juan Perez"
                            className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-2">
                            Documento de Identidad
                          </label>
                          <input
                            type="text"
                            value={formData.documentId}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                              setFormData({ ...formData, documentId: value })
                            }}
                            placeholder="12345678"
                            maxLength={8}
                            className="w-full bg-stone-50 rounded-lg px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary (Sticky) */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-32 bg-stone-50 p-6 rounded-xl space-y-6">
                  <h2 className="text-xl font-semibold text-charcoal">Resumen del Pedido</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-b border-stone-200 pb-4">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Descuento (15%)</span>
                        <span>-{formatPrice(calculateDiscount())}</span>
                      </div>
                    )}
                    {calculateInterest() > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Interés (60%)</span>
                        <span>+{formatPrice(calculateInterest())}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-charcoal">Total</span>
                    <span className="text-2xl font-bold text-charcoal">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>

                  {/* Trust Elements */}
                  <div className="space-y-2 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Shield size={16} />
                      <span>Compra protegida</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Truck size={16} />
                      <span>Envíos a todo el país</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-stone-900 text-white py-4 rounded-full font-semibold hover:bg-stone-800 transition-colors text-base cursor-pointer"
                  >
                    {paymentMethod === "tarjeta" ? "Finalizar Pedido" : "Finalizar Pedido en WhatsApp"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

