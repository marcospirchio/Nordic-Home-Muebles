"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"

export interface FilterState {
  disponibilidad: {
    inmediata: boolean
    encargo: boolean
  }
  precioMin: string
  precioMax: string
  tipoMueble: string[]
  // Sala
  tamanoSofa: string[]
  materialTela: string[]
  // Cocina
  formaMesa: string[]
  material: string[]
  // Dormitorio
  medidaCama: string[]
  funcionalidad: string[]
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  // Sincronizar filtros locales cuando cambian los filtros externos
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleDisponibilidadChange = (key: "inmediata" | "encargo", checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      disponibilidad: {
        ...localFilters.disponibilidad,
        [key]: checked,
      },
    })
  }

  const handleTipoMuebleChange = (value: string, checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      tipoMueble: checked
        ? [...localFilters.tipoMueble, value]
        : localFilters.tipoMueble.filter((t) => t !== value),
    })
  }

  const handleArrayFilterChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean,
  ) => {
    const currentArray = (localFilters[key] as string[]) || []
    setLocalFilters({
      ...localFilters,
      [key]: checked
        ? [...currentArray, value]
        : currentArray.filter((v) => v !== value),
    })
  }

  const handleApplyPrice = () => {
    onFiltersChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
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
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  if (!isOpen) return null

  const isSala = pathname === "/living"
  const isCocina = pathname === "/cocina"
  const isDormitorio = pathname === "/dormitorio"

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl border border-stone-200 z-20 max-h-[80vh] overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Disponibilidad */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Disponibilidad</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.disponibilidad.inmediata}
                onChange={(e) => handleDisponibilidadChange("inmediata", e.target.checked)}
                className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
              />
              <span className="text-sm text-stone-600">Entrega Inmediata (Lo tengo ya)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.disponibilidad.encargo}
                onChange={(e) => handleDisponibilidadChange("encargo", e.target.checked)}
                className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
              />
              <span className="text-sm text-stone-600">
                Por Encargo / A Fabricación (Demora 30-45 días)
              </span>
            </label>
          </div>
        </div>

        {/* Rango de Precio */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Rango de Precio</h3>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-stone-600 mb-1 block">Mínimo</label>
              <input
                type="number"
                value={localFilters.precioMin}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, precioMin: e.target.value })
                }
                placeholder="0"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-stone-600 mb-1 block">Máximo</label>
              <input
                type="number"
                value={localFilters.precioMax}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, precioMax: e.target.value })
                }
                placeholder="999999"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Filtros específicos por categoría */}
        {isSala && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Tipo de Mueble</h3>
              <div className="space-y-2">
                {["Sillones", "Mesas Ratonas", "Muebles de TV", "Poltronas"].map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.tipoMueble.includes(tipo)}
                      onChange={(e) => handleTipoMuebleChange(tipo, e.target.checked)}
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Tamaño de Sofá</h3>
              <div className="space-y-2">
                {["2 Cuerpos", "3 Cuerpos", "Esquinero / L"].map((tamano) => (
                  <label key={tamano} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.tamanoSofa.includes(tamano)}
                      onChange={(e) =>
                        handleArrayFilterChange("tamanoSofa", tamano, e.target.checked)
                      }
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{tamano}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Material / Tela</h3>
              <div className="space-y-2">
                {[
                  "Pana (Antimanchas)",
                  "Lino (Fresco/Nórdico)",
                  "Cuero Ecológico",
                ].map((material) => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.materialTela.includes(material)}
                      onChange={(e) =>
                        handleArrayFilterChange("materialTela", material, e.target.checked)
                      }
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {isCocina && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Tipo de Mueble</h3>
              <div className="space-y-2">
                {["Mesas", "Sillas", "Vajilleros", "Barras"].map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.tipoMueble.includes(tipo)}
                      onChange={(e) => handleTipoMuebleChange(tipo, e.target.checked)}
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Forma de Mesa</h3>
              <div className="space-y-2">
                {[
                  "Rectangular",
                  "Redonda (Muy buscada para dptos chicos)",
                  "Cuadrada",
                ].map((forma) => (
                  <label key={forma} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.formaMesa.includes(forma)}
                      onChange={(e) =>
                        handleArrayFilterChange("formaMesa", forma, e.target.checked)
                      }
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{forma}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Material</h3>
              <div className="space-y-2">
                {[
                  "Madera Maciza (Petiribí/Paraíso)",
                  "Laqueado",
                  "Melamina (Económico)",
                ].map((material) => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.material.includes(material)}
                      onChange={(e) =>
                        handleArrayFilterChange("material", material, e.target.checked)
                      }
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {isDormitorio && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Tipo de Mueble</h3>
              <div className="space-y-2">
                {["Camas", "Respaldos", "Mesas de Luz", "Cómodas"].map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.tipoMueble.includes(tipo)}
                      onChange={(e) => handleTipoMuebleChange(tipo, e.target.checked)}
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Medida de Cama</h3>
              <div className="space-y-2">
                {["1 Plaza", "2 Plazas (1.40)", "Queen (1.60)", "King (1.80+)"].map((medida) => (
                  <label key={medida} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.medidaCama.includes(medida)}
                      onChange={(e) =>
                        handleArrayFilterChange("medidaCama", medida, e.target.checked)
                      }
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-600">{medida}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Funcionalidad</h3>
              <div className="space-y-2">
                {["Con Cajones (Espacio de guardado)", "Con Patas (Visualmente liviano)"].map(
                  (func) => (
                    <label key={func} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.funcionalidad.includes(func)}
                        onChange={(e) =>
                          handleArrayFilterChange("funcionalidad", func, e.target.checked)
                        }
                        className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                      />
                      <span className="text-sm text-stone-600">{func}</span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </>
        )}

        {/* Botón Reset */}
        <div className="pt-4 border-t border-stone-200">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel

