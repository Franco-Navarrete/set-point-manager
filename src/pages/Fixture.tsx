import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLeague } from "@/contexts/LeagueContext";
import { AlertCircle, MapPin, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Category = "Todos" | "Femenino" | "Masculino";

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
  age_category: "SUB_16" | "LIBRE";
  jornada: number;
  venue: string | null;
}

const Fixture = () => {
  const { selectedLeague } = useLeague();
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

  const genderCategories = ["Femenino", "Masculino"] as const;
  type AgeCategory = "SUB_16" | "LIBRE";
  const ageCategories: AgeCategory[] = ["LIBRE", "SUB_16"];

  const getCategoryColor = (category: "Femenino" | "Masculino") => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };

  const getAgeCategoryLabel = (ageCategory: AgeCategory) => {
    return ageCategory === "SUB_16" ? "Sub 16" : "Libre";
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

          {/* Matches by Category and Age */}
          <div className="space-y-8">
            {genderCategories.map((genderCategory) => (
              <div key={genderCategory} className="space-y-6">
                <h2 className="text-3xl font-bold">{genderCategory}</h2>
                {ageCategories.map((ageCategory) => {
                  const categoryMatches = matches.filter(
                    (m) => m.category === genderCategory && m.age_category === ageCategory
                  );

                  if (categoryMatches.length === 0) return null;

                  const jornadas = Array.from(new Set(categoryMatches.map(m => m.jornada))).sort((a, b) => a - b);

                  return (
                    <div key={`${genderCategory}-${ageCategory}`} className="space-y-4">
                      <h3 className="text-2xl font-semibold text-muted-foreground">
                        {getAgeCategoryLabel(ageCategory)}
                      </h3>
                      {jornadas.map((jornada) => {
                        const jornadaMatches = categoryMatches.filter(m => m.jornada === jornada);
                        const jornadaVenue = jornadaMatches[0]?.venue;

                        return (
                          <Card key={`${genderCategory}-${ageCategory}-${jornada}`} className="gradient-card">
                            <CardHeader>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <CardTitle className="text-xl">Jornada {jornada}</CardTitle>
                                  <Badge className={getCategoryColor(genderCategory)}>
                                    {jornadaMatches.length} partidos
                                  </Badge>
                                </div>
                                {jornadaVenue && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">{jornadaVenue}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jornadaVenue)}`, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Ver mapa
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {jornadaMatches.map((match) => (
                                <div key={match.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground w-full sm:w-auto">
                                    <span className="font-medium capitalize">
                                      {formatDate(match.date)}
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{match.time}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between gap-4 w-full sm:flex-1">
                                    <div className="flex-1 text-right">
                                      <p className="font-semibold">{getTeamName(match.team_a_id)}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 px-4 py-2 bg-background rounded-lg min-w-[100px] justify-center">
                                      {match.score_a !== null && match.score_b !== null ? (
                                        <>
                                          <span className="text-xl font-bold text-primary">{match.score_a}</span>
                                          <span className="text-muted-foreground">-</span>
                                          <span className="text-xl font-bold text-primary">{match.score_b}</span>
                                        </>
                                      ) : (
                                        <span className="text-muted-foreground font-medium">VS</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 text-left">
                                      <p className="font-semibold">{getTeamName(match.team_b_id)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Fixture;
