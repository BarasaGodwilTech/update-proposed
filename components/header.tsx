import { Laptop } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center gap-2">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="text-2xl font-bold transition-transform group-hover:scale-105">WILL'S</span>
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Laptop className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold transition-transform group-hover:scale-105">TECH</span>
          </a>
          <p className="text-sm opacity-90 text-center text-balance">Elevate Your Lifestyle With Authentic Tech</p>
        </div>
      </div>
    </header>
  )
}
