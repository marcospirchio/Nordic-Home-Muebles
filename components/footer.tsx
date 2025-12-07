import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-light tracking-tight mb-4">Nordic Home</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Muebles escandinavos curados para el hogar moderno. Diseño atemporal con calidad excepcional.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">Enlaces Rápidos</h4>
            <div className="space-y-3 text-sm">
              <a href="/" className="block text-gray-300 hover:text-white transition">
                Inicio
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition">
                Nuevos Productos
              </a>
              <a href="/contacto" className="block text-gray-300 hover:text-white transition">
                Sobre Nosotros
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">Contacto</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <a
                href="https://www.google.com.ar/maps/place/Av.+Directorio+912,+C1424CIW+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6290169,-58.4424621,17z/data=!3m1!4b1!4m5!3m4!1s0x95bcca49f9521577:0x872935f84053257f!8m2!3d-34.6290213!4d-58.4398872?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white hover:underline transition"
              >
                Av. Directorio 912
              </a>
              <p>Caballito, CABA, C1424 </p>
              <p>+54 11 2764 9873</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          {/* Social */}
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <a
              href="https://instagram.com/nordichome"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition"
            >
              <Instagram size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 font-light">© 2025 Nordic Home. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
