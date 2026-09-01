import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

const quickLinks = [
  { name: "Inicio", to: "/" },
  { name: "Fixture", to: "/fixture" },
  { name: "Tabla de posiciones", to: "/tabla" },
  { name: "Equipos", to: "/equipos" },
  { name: "Noticias", to: "/noticias" },
  { name: "Sobre Nosotros", to: "/sobre-nosotros" },
  { name: "Contacto", to: "/contacto" },
];

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">El Ocampense</h3>
            <p className="text-foreground/80 text-sm">
              Promoviendo el vóley y la comunidad deportiva local desde 2024.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">Enlaces rápidos</h3>
            <div className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-foreground/80 hover:text-primary hover:translate-x-2 hover:font-medium transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">Contacto</h3>
            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/5493543556144"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                WhatsApp
              </a>
              <a
                href="tel:+5493543556144"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                +54 9 3543 556144
              </a>
              <a
                href="mailto:contacto@ligaelocampense.com"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" />
                contacto@ligaelocampense.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/ElOcampense/?ref=_xav_ig_profile_page_web#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary hover:scale-125 hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/elocampense?igsh=amI4c2d0YmkzbDB4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary hover:scale-125 hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="mailto:contacto@ligaelocampense.com"
                className="text-foreground/80 hover:text-primary hover:scale-125 hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/80">
          © 2025 El Ocampense. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
