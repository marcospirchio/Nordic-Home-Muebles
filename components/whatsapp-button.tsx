"use client"

import Image from "next/image"

export function WhatsAppButton() {
  const whatsappNumber = "1234567890" // Replace with actual WhatsApp number
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <Image
        src="/icons8-whatsapp-48.png"
        alt="WhatsApp"
        width={32}
        height={32}
        className="object-contain"
      />
    </a>
  )
}

export default WhatsAppButton

