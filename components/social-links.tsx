import { Facebook, Instagram, Twitter } from "lucide-react"

export function SocialLinks() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/willstech.store", label: "Instagram" },
    { icon: Twitter, href: "https://x.com/willstech_store", label: "Twitter" },
  ]

  return (
    <div className="flex justify-center gap-6 mt-8">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
        >
          <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  )
}
