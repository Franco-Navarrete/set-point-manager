import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Users, Newspaper } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-volleyball.jpg";

// Slot de publicidad para ubicar a ambos lados de secciones
const AdSlot = ({ imageSrc, href }: { imageSrc?: string; href?: string }) => {
  return (
    <div className="hidden lg:block">
      {imageSrc ? (
        <a href={href || "#"} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={imageSrc}
            alt="Publicidad"
            className="w-full rounded-md border border-border shadow-card object-cover"
            style={{ maxHeight: 280 }}
          />
        </a>
      ) : (
        <div className="h-[280px] rounded-md border border-dashed border-border bg-muted/30 flex items-center justify-center text-center px-3">
          <span className="text-sm text-foreground/80">Espacio disponible para publicidad</span>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Fixture",
      description: "Consulta el calendario completo de partidos",
      link: "/fixture",
    },
    {
      icon: Trophy,
      title: "Tabla",
      description: "Revisa las posiciones y estadísticas",
      link: "/tabla",
    },
    {
      icon: Users,
      title: "Equipos",
      description: "Conoce a todos los equipos participantes",
      link: "/equipos",
    },
    {
      icon: Newspaper,
      title: "Noticias",
      description: "Mantente al día con las últimas novedades",
      link: "/noticias",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance">
                El Ocampense
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-6 sm:mb-8 text-balance">
                Uniendo comunidad, deporte y pasión. Competencia sana para todos los niveles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/fixture">
                  <Button size="lg" className="w-full sm:w-auto shadow-glow text-sm sm:text-base">
                    Ver Fixture
                  </Button>
                </Link>
                <Link to="/sobre-nosotros">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                    Sobre Nosotros
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid con espacios de publicidad a ambos lados */}
        <section className="py-10 sm:py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[220px,1fr,220px] gap-6 items-start">
              <AdSlot />
              <div>
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Accesos rápidos</h2>
                  <p className="text-foreground/80 text-base sm:text-lg">
                    Toda la información que necesitas en un solo lugar
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {features.map((feature, index) => (
                    <Link key={index} to={feature.link}>
                      <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer gradient-card border-border/50">
                        <CardContent className="p-4 sm:p-6 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                          </div>
                          <h3 className="font-bold text-base sm:text-xl mb-1 sm:mb-2">{feature.title}</h3>
                          <p className="text-foreground/80 text-xs sm:text-sm md:text-base hidden sm:block">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
              <AdSlot />
            </div>
          </div>
        </section>

        {/* Values Section con espacios de publicidad a ambos lados */}
        <section className="py-10 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[220px,1fr,220px] gap-6 items-start">
              <AdSlot />
              <div>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Nuestros Valores</h2>
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-foreground/80">
                <p>
                  El Ocampense nace del amor por el vóley y el deseo de fortalecer nuestra comunidad deportiva.
                </p>
                    <p>
                      Promovemos la <span className="text-primary font-semibold">competencia sana</span>, 
                      el <span className="text-primary font-semibold">respeto mutuo</span> y 
                      el <span className="text-primary font-semibold">crecimiento conjunto</span> de todos los participantes.
                    </p>
                    <p>
                      Más que un torneo, somos una familia unida por la pasión deportiva.
                    </p>
                  </div>
                </div>
              </div>
              <AdSlot />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
