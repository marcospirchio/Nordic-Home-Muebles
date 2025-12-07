"use client"

import { useState, useRef, useEffect } from "react"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { FilterPanel, FilterState } from "@/components/filter-panel"

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

interface CategoryToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function CategoryToolbar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  filters,
  onFiltersChange,
}: CategoryToolbarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const sortOptions = [
    { value: "default" as SortOption, label: "Por defecto" },
    { value: "price-asc" as SortOption, label: "Precio: Menor a Mayor" },
    { value: "price-desc" as SortOption, label: "Precio: Mayor a Menor" },
    { value: "name-asc" as SortOption, label: "Nombre: A-Z" },
    { value: "name-desc" as SortOption, label: "Nombre: Z-A" },
  ]

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortOption)?.label || "Ordenar"

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 md:max-w-md">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search size={18} className="text-stone-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-b border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors duration-200 text-sm font-light"
        />
      </div>

      {/* Filter & Sort Actions */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={filterButtonRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors duration-200 text-sm font-medium"
          >
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
          </button>
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        </div>
        <div className="relative" ref={sortMenuRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors duration-200 text-sm font-medium"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-stone-200 z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setIsSortOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                      sortOption === option.value
                        ? "bg-stone-100 text-stone-900 font-medium"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryToolbar

