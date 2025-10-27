import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart, Users, Trophy, Target } from "lucide-react";

const SobreNosotros = () => {
  const values = [
    {
      icon: Heart,
      title: "Pasión por el deporte",
      description: "El vóley nos une y nos motiva a dar lo mejor de nosotros en cada partido.",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Creamos lazos que van más allá de la cancha, fortaleciendo nuestra ciudad.",
    },
    {
      icon: Trophy,
      title: "Competencia sana",
      description: "Fomentamos el juego limpio y el respeto entre todos los participantes.",
    },
    {
      icon: Target,
      title: "Crecimiento",
      description: "Buscamos mejorar constantemente, tanto en lo deportivo como en lo personal.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Más que un torneo, somos una familia unida por el amor al vóley
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Nuestra Historia</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  La <span className="text-foreground font-semibold">Liga Elo Campense de Vóley</span> nace 
                  en 2024 con un sueño: crear un espacio donde la pasión por el voleibol se combine con el 
                  espíritu de comunidad que caracteriza a nuestra ciudad.
                </p>
                <p>
                  Lo que comenzó como una iniciativa de un grupo de amigos apasionados por el deporte, 
                  rápidamente se transformó en un movimiento que reúne a jugadores y jugadoras de todos 
                  los niveles, con un objetivo común: <span className="text-foreground font-semibold">disfrutar, 
                  competir y crecer juntos</span>.
                </p>
                <p>
                  Hoy, nuestra liga es un referente del vóley local, promoviendo valores como el trabajo 
                  en equipo, el respeto mutuo y la superación personal. Cada partido es una oportunidad 
                  para fortalecer lazos y celebrar el deporte que nos une.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 gradient-card">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Quieres unirte?</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Si compartes nuestra pasión por el vóley y quieres ser parte de esta comunidad, 
                te invitamos a conocernos. Participar es simple: solo necesitas ganas de jugar, 
                aprender y disfrutar junto a otros amantes del deporte.
              </p>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Categorías para todos: Femenino, Masculino y Mixto
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Ambiente amigable y competitivo
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Torneos regulares durante todo el año
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

export default SobreNosotros;
