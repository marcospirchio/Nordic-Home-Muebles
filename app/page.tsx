import Header from "@/components/header"
import Hero from "@/components/hero"
import CategoryGrid from "@/components/category-grid"
import FeaturedProducts from "@/components/featured-products"
import ShopTheLook from "@/components/shop-the-look"
import Footer from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <ShopTheLook />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
