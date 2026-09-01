import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Users, Newspaper, Flame, HeartHandshake, Medal } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-volleyball.jpg";
import { useHomeData } from "@/hooks/useHomeData";
import NextMatchSection from "@/components/home/NextMatchSection";
import LatestResultsSection from "@/components/home/LatestResultsSection";
import StandingsPreviewSection from "@/components/home/StandingsPreviewSection";
import NextRoundSection from "@/components/home/NextRoundSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";

const Home = () => {
  const {
    loading,
    leagueName,
    nextMatch,
    lastResults,
    nextRoundDate,
    nextRoundMatches,
    standings,
    news,
    teamName,
    teamLogo,
  } = useHomeData();

  const features = [
    { icon: Calendar, title: "Fixture", description: "Calendario completo de partidos", link: "/fixture" },
    { icon: Trophy, title: "Tabla", description: "Posiciones y estadísticas", link: "/tabla" },
    { icon: Users, title: "Equipos", description: "Equipos participantes", link: "/equipos" },
    { icon: Newspaper, title: "Noticias", description: "Últimas novedades", link: "/noticias" },
  ];

  const values = [
    { icon: Flame, title: "Pasión", text: "El vóley como motor que nos mueve fecha a fecha." },
    { icon: HeartHandshake, title: "Comunidad", text: "Clubes, familias y amigos unidos por el deporte." },
    { icon: Medal, title: "Competencia", text: "Juego sano, respeto y crecimiento en todos los niveles." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[300px] sm:h-[400px] md:h-[560px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              {leagueName && (
                <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  {leagueName}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-5 uppercase tracking-tight text-balance">
                El Ocampense
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-foreground/80 mb-5 sm:mb-8 text-balance max-w-2xl">
                Ligas y eventos de vóley que unen comunidad, deporte y pasión. Fixture, resultados y posiciones
                siempre actualizados.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/fixture">
                  <Button size="lg" className="w-full sm:w-auto shadow-glow">
                    Ver Fixture
                  </Button>
                </Link>
                <Link to="/tabla">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Tabla de posiciones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-tight mb-2">Accesos rápidos</h2>
              <p className="text-foreground/80 text-sm sm:text-base">
                Toda la información que necesitás en un solo lugar
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {features.map((feature) => (
                <Link key={feature.link} to={feature.link}>
                  <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer gradient-card border-border/50">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-sm sm:text-xl mb-1">{feature.title}</h3>
                      <p className="text-foreground/80 text-xs sm:text-sm hidden sm:block">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="container mx-auto px-4 py-12 space-y-4">
            <div className="h-32 rounded-xl bg-muted/40 animate-pulse" />
            <div className="h-32 rounded-xl bg-muted/40 animate-pulse" />
          </div>
        ) : (
          <>
            <NextMatchSection
              match={nextMatch}
              leagueName={leagueName}
              teamName={teamName}
              teamLogo={teamLogo}
            />
            <LatestResultsSection results={lastResults} teamName={teamName} />
            <StandingsPreviewSection rows={standings} />
            <NextRoundSection date={nextRoundDate} matches={nextRoundMatches} teamName={teamName} />
            <LatestNewsSection news={news} />
          </>
        )}

        {/* Valores */}
        <section className="py-10 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-tight mb-2">Nuestros valores</h2>
              <p className="text-foreground/80 text-sm sm:text-base">
                Más que un torneo: una familia unida por la pasión deportiva
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {values.map((v) => (
                <Card key={v.title} className="gradient-card border-border/50 h-full">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <v.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-2 uppercase">{v.title}</h3>
                    <p className="text-sm text-foreground/80">{v.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
