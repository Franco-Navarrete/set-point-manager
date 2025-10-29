import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Liga Elo Campense</h3>
            <p className="text-muted-foreground text-sm">
              Promoviendo el vóley y la comunidad deportiva local desde 2024.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces rápidos</h3>
            <div className="space-y-2 text-sm">
              <Link to="/fixture" className="block text-muted-foreground hover:text-primary transition-colors">
                Fixture
              </Link>
              <Link to="/tabla" className="block text-muted-foreground hover:text-primary transition-colors">
                Tabla de posiciones
              </Link>
              <Link to="/equipos" className="block text-muted-foreground hover:text-primary transition-colors">
                Equipos
              </Link>
              <Link to="/contacto" className="block text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/ElOcampense/?ref=_xav_ig_profile_page_web#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/elocampense?igsh=amI4c2d0YmkzbDB4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a href="mailto:contacto@ligaelocampense.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 Liga Elo Campense de Vóley. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
