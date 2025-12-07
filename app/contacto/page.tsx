"use client"

import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero Section for Category */}
        <section className="py-16 px-6 bg-off-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-light tracking-tight text-charcoal mb-4">¿Quiénes somos?</h1>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Somos fabricantes apasionados por el diseño nórdico. Creamos muebles que combinan
                funcionalidad y estética para transformar tu hogar. Vení a conocer la calidad de nuestras
                maderas y terminaciones en persona.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-12 pb-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Content & Story */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-light tracking-tight text-charcoal mb-6">
                    Visitá nuestro Local
                  </h2>
                  <p className="text-gray-600 text-lg font-light leading-relaxed max-w-xl">
                  Acercate a conocer la calidad de nuestros materiales. Ofrecemos atención personalizada 
                  y fabricación a medida para concretar tus ideas. También realizamos visitas técnicas a 
                  domicilio para rectificar medidas y asesorarte en el lugar, asegurando que tu elección sea la correcta.
                  </p>
                </div>

                {/* Details Block */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin size={24} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal mb-1">Dirección</h3>
                      <p className="text-gray-600 font-light">Av. Directorio 912, Caballito, CABA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Clock size={24} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal mb-1">Horarios de Atención</h3>
                      <p className="text-gray-600 font-light">
                        Lun-Vie: 10:00 - 19:00 | Sáb: 10:00 - 14:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Phone size={24} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal mb-1">Teléfono / WhatsApp</h3>
                      <a
                        href="https://wa.me/541112345678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 font-light hover:text-charcoal transition-colors"
                      >
                        +54 11 2764 9873
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Mail size={24} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal mb-1">Email</h3>
                      <a
                        href="mailto:hola@nordichome.com.ar"
                        className="text-gray-600 font-light hover:text-charcoal transition-colors"
                      >
                        clientes@nordichome.com.ar
                      </a>
                    </div>
                  </div>
                </div>

                {/* Extra Trust Info */}
                <div className="pt-8 border-t border-stone-200">
                  <p className="text-sm text-gray-500 font-light">
                    Envíos a todo el país por Vía Cargo / Andreani / Flete Privado
                  </p>
                  <p className="text-sm text-gray-500 font-light">
                    Estacionamiento disponible para clientes
                  </p>
                </div>
              </div>

              {/* Right Column - Interactive Map */}
              <div className="lg:sticky lg:top-32">
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps?q=Av.+Directorio+912,+Cdad.+Autónoma+de+Buenos+Aires&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

