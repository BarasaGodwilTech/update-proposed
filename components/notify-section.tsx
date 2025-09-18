"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotifySection() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section id="notify" className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-balance">
          Get Notified When We Launch!
        </h2>

        {!showForm ? (
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            <Bell className="w-5 h-5 mr-2" />
            Notify Me at Launch
          </Button>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">Launch Notification</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfJbLXNxghRFZSjUhkgKzpMRBmf8rIak9Hk1e0W-c3ovrK2xQ/viewform?embedded=true&headers=true"
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Launch Notification Form"
                className="rounded-lg"
              >
                Loading...
              </iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
