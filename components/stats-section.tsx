"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Smartphone, Clock, Star } from "lucide-react"

const stats = [
  { icon: Users, value: 1000, label: "Happy Customers", suffix: "+" },
  { icon: Smartphone, value: 500, label: "Products Available", suffix: "+" },
  { icon: Clock, value: 24, label: "Hours Support", suffix: "" },
  { icon: Star, value: 99, label: "Satisfaction Rate", suffix: "%" },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({
  icon: Icon,
  value,
  label,
  suffix,
}: {
  icon: any
  value: number
  label: string
  suffix: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          animateCounter()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  const animateCounter = () => {
    const duration = 2000
    const step = value / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
  }

  return (
    <div ref={ref} className="text-center group hover:scale-105 transition-transform duration-300">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  )
}
