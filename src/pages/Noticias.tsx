import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock } from "lucide-react";

interface News {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: "Torneo" | "Resultados" | "Comunicados";
}

const Noticias = () => {
  const news: News[] = [
    {
      id: 1,
      title: "¡Arranca la Liga Elo Campense 2025!",
      summary: "Con gran emoción damos inicio oficial a la temporada 2025 de nuestra liga. Esperamos partidos llenos de energía y deportividad.",
      date: "2025-10-20",
      category: "Torneo",
    },
    {
      id: 2,
      title: "Águilas Voladoras mantiene el invicto",
      summary: "El equipo femenino consigue su segunda victoria consecutiva con un impresionante 3-1 ante Tigres del Norte.",
      date: "2025-11-05",
      category: "Resultados",
    },
    {
      id: 3,
      title: "Modificación de horarios - Jornada 3",
      summary: "Por motivos de disponibilidad del gimnasio, los partidos de la jornada 3 se adelantan 30 minutos. Revisar fixture actualizado.",
      date: "2025-11-10",
      category: "Comunicados",
    },
    {
      id: 4,
      title: "Leones Azules gana en un partido reñido",
      summary: "En un encuentro muy parejo, Leones Azules se impuso 3-2 a Halcones FC en la categoría masculina.",
      date: "2025-11-05",
      category: "Resultados",
    },
    {
      id: 5,
      title: "Próximos encuentros de categoría mixta",
      summary: "Este fin de semana debutan los equipos de categoría mixta. ¡No te pierdas estos emocionantes partidos!",
      date: "2025-11-08",
      category: "Torneo",
    },
  ];

  const getCategoryColor = (category: News["category"]) => {
    switch (category) {
      case "Torneo":
        return "bg-primary/10 text-primary";
      case "Resultados":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Comunicados":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Noticias</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Las últimas novedades de la liga
          </p>

          <div className="space-y-6">
            {news.map((item) => (
              <Card key={item.id} className="hover:shadow-card transition-all duration-300 gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(item.date)}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Noticias;
