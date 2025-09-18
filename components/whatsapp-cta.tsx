import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Get Exclusive Deals on WhatsApp!</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto text-pretty">
          Be the first to know about our launch discounts and flash sales.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
          asChild
        >
          <a href="https://wa.me/256751924844?text=Hi%20Will's%20Tech!%20I%20want%20to%20join%20your%20channel.">
            <MessageCircle className="w-5 h-5 mr-2" />
            Join Now
          </a>
        </Button>
      </div>
    </section>
  )
}
