import { Laptop } from "lucide-react"
import { SocialLinks } from "@/components/social-links"

export function Footer() {
  const footerLinks = {
    products: ["Smartphones", "Laptops", "Accessories", "Gaming"],
    support: ["Contact Us", "Warranty", "Repairs", "FAQ"],
    company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
  }

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">Will's</span>
              <Laptop className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-secondary">Tech</span>
            </div>
            <p className="text-gray-300 text-pretty leading-relaxed">
              Premium tech, delivered with care. Uganda's trusted source for authentic technology products.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-blue-600 rounded text-xs font-bold">VISA</div>
                <div className="px-2 py-1 bg-red-600 rounded text-xs font-bold">MC</div>
                <div className="px-2 py-1 bg-yellow-600 rounded text-xs font-bold">MTN</div>
                <div className="px-2 py-1 bg-red-500 rounded text-xs font-bold">AIRTEL</div>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <SocialLinks />
          <p className="text-gray-400 text-center">&copy; 2025 Will's Tech Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
