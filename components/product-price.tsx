interface ProductPriceProps {
  price: string
  cashPrice?: string
  priceLabel?: "transferencia" | "oportunidad" | "credito"
  isLastUnits?: boolean
}

export function ProductPrice({ price, cashPrice, priceLabel = "transferencia", isLastUnits = false }: ProductPriceProps) {
  if (cashPrice) {
    // Caso: Precio con "credito/debito" en gris (sin tachar)
    if (priceLabel === "credito") {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-sm font-light">{price}</p>
            <span className="text-gray-500 text-xs">Tarjeta de Crédito/Débito</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-stone-900 text-lg font-bold">{cashPrice}</p>
            <span className="text-green-700 text-xs font-medium">con Transferencia o Efectivo</span>
          </div>
        </div>
      )
    }

    // Caso: Oportunidad (Últimas Unidades)
    if (priceLabel === "oportunidad") {
      return (
        <div className="space-y-1">
          <p className="text-gray-400 text-sm font-light line-through">{price}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-stone-900 text-lg font-bold">{cashPrice}</p>
            <span className="text-green-700 text-xs font-medium">Últimas Unidade</span>
          </div>
        </div>
      )
    }
    
    // Caso: Producto con cashPrice y isLastUnits
    if (isLastUnits) {
      return (
        <div className="space-y-1">
          <p className="text-gray-400 text-sm font-light line-through">{price}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-stone-900 text-lg font-bold">{cashPrice || price}</p>
            <span className="text-green-700 text-xs font-medium">Últimas Unidades</span>
          </div>
        </div>
      )
    }

    // Caso por defecto: Transferencia o Efectivo
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-gray-600 text-sm font-light">{price}</p>
          <span className="text-gray-500 text-xs">Tarjeta de Crédito/Débito</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-stone-900 text-lg font-bold">{cashPrice}</p>
          <span className="text-green-700 text-xs font-medium">15% OFF con Transferencia o Efectivo</span>
        </div>
      </div>
    )
  }

  // Caso: Producto sin cashPrice con isLastUnits
  if (isLastUnits) {
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
    
    const previousPrice = calculatePreviousPrice(price)
    
    return (
      <div className="space-y-1">
        <p className="text-gray-400 text-sm font-light line-through">{previousPrice}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-stone-900 text-lg font-bold">{price}</p>
          <span className="text-green-700 text-xs font-medium">Últimas Unidades</span>
        </div>
      </div>
    )
  }

  // Caso: Producto sin cashPrice - también mostrar "Tarjeta de Credito/Debito"
  return (
    <div className="flex items-center gap-2">
      <p className="text-gray-600 text-sm font-light">{price}</p>
      <span className="text-gray-500 text-xs">Tarjeta de Crédito/Débito</span>
    </div>
  )
}

export default ProductPrice

