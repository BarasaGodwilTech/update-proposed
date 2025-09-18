"use client"

import { useEffect, useState } from "react"
import { Laptop } from "lucide-react"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return newProgress
      })
    }, 100)

    // Ensure loader hides even if slow connection
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setIsLoading(false), 500)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-bold text-primary">WILL'S</span>
          <div className="p-3 bg-primary/10 rounded-full animate-pulse-glow">
            <Laptop className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl font-bold text-secondary">TECH</span>
        </div>

        <div className="w-80 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-muted-foreground animate-pulse">Loading amazing tech experience...</p>
      </div>
    </div>
  )
}
