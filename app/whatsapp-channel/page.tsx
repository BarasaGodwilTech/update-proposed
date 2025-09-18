"use client"

import { useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppChannelPage() {
  useEffect(() => {
    // Detect if not Android and replace with iOS deep link
    const isAndroid = navigator.userAgent.toLowerCase().includes("android")
    const channelLink = document.getElementById("channel-link") as HTMLAnchorElement

    if (!isAndroid && channelLink) {
      channelLink.href = "whatsapp://channel/0029VaJO5e1LY6d9EtRSHg3A"
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Join My WhatsApp Channel</h1>

        <p className="text-muted-foreground">Click the button below to open directly in WhatsApp:</p>

        <Button
          id="channel-link"
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full"
          asChild
        >
          <a href="intent://channel/0029VaJO5e1LY6d9EtRSHg3A#Intent;package=com.whatsapp;scheme=whatsapp;end">
            Open Channel in WhatsApp
          </a>
        </Button>

        <p className="text-sm text-muted-foreground">
          If nothing happens,{" "}
          <a href="https://whatsapp.com/channel/0029VaJO5e1LY6d9EtRSHg3A" className="text-primary hover:underline">
            open on WhatsApp Web
          </a>
          .
        </p>
      </div>
    </div>
  )
}
