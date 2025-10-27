import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Users, Newspaper } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-volleyball.jpg";

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
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
                Liga Elo Campense de <span className="gradient-hero bg-clip-text text-transparent">Vóley</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
                Uniendo comunidad, deporte y pasión. Competencia sana para todos los niveles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/fixture">
                  <Button size="lg" className="w-full sm:w-auto shadow-glow">
                    Ver Fixture
                  </Button>
                </Link>
                <Link to="/sobre-nosotros">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sobre Nosotros
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Accesos rápidos</h2>
              <p className="text-muted-foreground text-lg">
                Toda la información que necesitas en un solo lugar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Link key={index} to={feature.link}>
                  <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer gradient-card border-border/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestros Valores</h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  La Liga Elo Campense nace del amor por el vóley y el deseo de fortalecer nuestra comunidad deportiva.
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
