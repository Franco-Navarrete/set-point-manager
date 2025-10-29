import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLeague } from "@/contexts/LeagueContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface News {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

const Noticias = () => {
  const { selectedLeague } = useLeague();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [selectedLeague]);

  const loadNews = async () => {
    setLoading(true);
    try {
      let newsQuery = supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      
      if (selectedLeague) {
        newsQuery = newsQuery.eq("league_id", selectedLeague.id);
      }

      const { data, error } = await newsQuery;

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      toast.error("Error al cargar noticias");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando noticias...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Noticias</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Las últimas novedades de la liga
          </p>

          {!selectedLeague && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecciona una liga o evento desde el menú superior para ver las noticias
              </AlertDescription>
            </Alert>
          )}

          {news.length === 0 ? (
            <Card className="gradient-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No hay noticias publicadas aún
                </p>
              </CardContent>
            </Card>
          ) : (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Noticias;
