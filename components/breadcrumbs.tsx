import Link from "next/link"

interface BreadcrumbsProps {
  currentPage: string
}

export function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  return (
    <nav className="text-xs sm:text-sm">
      <div className="flex items-center gap-2 justify-start">
        <Link
          href="/"
          className="text-stone-500 hover:text-stone-600 transition-colors duration-200"
        >
          Inicio
        </Link>
        <span className="text-stone-500">/</span>
        <span className="text-stone-500">{currentPage}</span>
      </div>
    </nav>
  )
}

export default Breadcrumbs

