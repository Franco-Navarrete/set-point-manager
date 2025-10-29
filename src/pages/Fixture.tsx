import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLeague } from "@/contexts/LeagueContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Category = "Todos" | "Femenino" | "Masculino" | "Mixto";

interface Team {
  id: string;
  name: string;
}

interface Match {
  id: string;
  date: string;
  time: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  category: Exclude<Category, "Todos">;
  jornada: number;
}

const Fixture = () => {
  const { selectedLeague } = useLeague();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedLeague]);

  const loadData = async () => {
    setLoading(true);
    try {
      let matchesQuery = supabase.from("matches").select("*").order("date");
      
      if (selectedLeague) {
        matchesQuery = matchesQuery.eq("league_id", selectedLeague.id);
      }

      const [matchesResponse, teamsResponse] = await Promise.all([
        matchesQuery,
        supabase.from("teams").select("id, name"),
      ]);

      if (matchesResponse.error) throw matchesResponse.error;
      if (teamsResponse.error) throw teamsResponse.error;

      setMatches(matchesResponse.data || []);
      setTeams(teamsResponse.data || []);
    } catch (error) {
      toast.error("Error al cargar fixture");
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Equipo";
  };

  const categories: Category[] = ["Todos", "Femenino", "Masculino", "Mixto"];

  const filteredMatches = selectedCategory === "Todos" 
    ? matches 
    : matches.filter(match => match.category === selectedCategory);

  const getCategoryColor = (category: Exclude<Category, "Todos">) => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Mixto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando fixture...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fixture</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Calendario completo de partidos del torneo
          </p>

          {!selectedLeague && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecciona una liga o evento desde el menú superior para ver los partidos
              </AlertDescription>
            </Alert>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Matches List */}
          <div className="space-y-6">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-card transition-all duration-300 gradient-card">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="text-lg">
                        Jornada {match.jornada}
                      </CardTitle>
                      <Badge className={getCategoryColor(match.category)}>
                        {match.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formatDate(match.date)} • {match.time}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-lg">{getTeamName(match.team_a_id)}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 px-6 py-3 bg-muted rounded-lg min-w-[120px] justify-center">
                        {match.score_a !== null && match.score_b !== null ? (
                          <>
                            <span className="text-2xl font-bold">{match.score_a}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-2xl font-bold">{match.score_b}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground font-medium">VS</span>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-lg">{getTeamName(match.team_b_id)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="gradient-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No hay partidos programados en esta categoría
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Fixture;
