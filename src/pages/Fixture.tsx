import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLeague } from "@/contexts/LeagueContext";
import { AlertCircle, MapPin, ExternalLink, Calendar, Clock } from "lucide-react";
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
  venue_maps_url: string | null;
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
          <p className="text-foreground/80">Cargando fixture...</p>
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
          <p className="text-foreground/80 text-lg mb-4">
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

          {/* Matches grouped by Date */}
          <div className="space-y-6">
            {(() => {
              // Group all matches by date
              const dates = Array.from(new Set(matches.map(m => m.date))).sort();
              
              if (dates.length === 0 && selectedLeague) {
                return (
                  <p className="text-center text-foreground/60 py-8">
                    No hay partidos programados para esta liga
                  </p>
                );
              }

              return dates.map((date) => {
                const dateMatches = matches.filter(m => m.date === date);
                const dateVenue = dateMatches[0]?.venue;
                const dateMapsUrl = dateMatches[0]?.venue_maps_url;

                const handleOpenMap = () => {
                  if (dateMapsUrl) {
                    window.open(dateMapsUrl, '_blank');
                  } else if (dateVenue) {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dateVenue)}`, '_blank');
                  }
                };

                return (
                  <Card key={date} className="gradient-card">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <CardTitle className="text-xl capitalize">
                              {formatDate(date)}
                            </CardTitle>
                          </div>
                          <Badge variant="secondary">
                            {dateMatches.length} partidos
                          </Badge>
                        </div>
                        
                        {/* Ubicación destacada */}
                        {dateVenue && (
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground/80">{dateVenue}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 ml-1"
                              onClick={handleOpenMap}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Ver mapa
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {dateMatches.map((match) => (
                        <div key={match.id} className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
                            <div className="flex items-center gap-2 text-foreground/70">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-medium">{match.time}</span>
                            </div>
                            <Badge className={`${getCategoryColor(match.category)} text-xs`}>
                              {match.category}
                            </Badge>
                            {match.age_category === "SUB_16" && (
                              <Badge variant="outline" className="text-xs">
                                Sub 16
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between gap-3 w-full sm:flex-1">
                            <div className="flex-1 text-right">
                              <p className="font-semibold text-sm sm:text-base">{getTeamName(match.team_a_id)}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg min-w-[80px] justify-center">
                              {match.score_a !== null && match.score_b !== null ? (
                                <>
                                  <span className="text-lg font-bold text-primary">{match.score_a}</span>
                                  <span className="text-foreground/60">-</span>
                                  <span className="text-lg font-bold text-primary">{match.score_b}</span>
                                </>
                              ) : (
                                <span className="text-foreground/60 font-medium text-sm">VS</span>
                              )}
                            </div>
                            
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-sm sm:text-base">{getTeamName(match.team_b_id)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Fixture;
