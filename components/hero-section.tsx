import { MessageCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/tech-circuit-pattern.png')] bg-repeat opacity-20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            Your Ultimate Online{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient">
              Tech Store
            </span>{" "}
            Is Coming Soon!
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto text-pretty leading-relaxed">
            We're working hard to bring you the ultimate tech shopping experience, delivering authentic and top-notch
            technologies and innovation to your doorstep without lifting a foot. Uganda, are you ready? Join our
            WhatsApp channel for exclusive early-bird deals!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              asChild
            >
              <a href="https://wa.me/256751924844?text=Hi%20Will's%20Tech!%20I%20want%20to%20join%20your%20channel.%20Thanks.">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join WhatsApp Channel
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
              asChild
            >
              <a href="#notify">
                <Bell className="w-5 h-5 mr-2" />
                Notify Me at Launch
              </a>
            </Button>
          </div>

          <SocialLinks />
        </div>
      </div>
    </section>
  )
}
