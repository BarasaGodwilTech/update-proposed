"use client"

import { useState, useEffect } from "react"
import { ArrowUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-glow"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      <Button
        size="icon"
        className="rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:scale-110 transition-all duration-300"
        asChild
        aria-label="Contact on WhatsApp"
      >
        <a href="https://wa.me/256751924844">
          <MessageCircle className="w-5 h-5" />
        </a>
      </Button>
    </div>
  )
}
