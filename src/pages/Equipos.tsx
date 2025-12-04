import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import teamPlaceholder from "@/assets/team-placeholder.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLeague } from "@/contexts/LeagueContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
  logo_url: string | null;
}

interface Player {
  id: string;
  team_id: string;
  name: string;
  position: number;
}

const Equipos = () => {
  const { selectedLeague } = useLeague();
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedLeague]);

  const loadData = async () => {
    setLoading(true);
    try {
      let teamsQuery = supabase.from("teams").select("*").order("name");
      
      if (selectedLeague) {
        teamsQuery = teamsQuery.eq("league_id", selectedLeague.id);
      }

      const [teamsResponse, playersResponse] = await Promise.all([
        teamsQuery,
        supabase.from("players").select("*").order("position"),
      ]);

      if (teamsResponse.error) throw teamsResponse.error;
      if (playersResponse.error) throw playersResponse.error;

      setTeams(teamsResponse.data || []);
      setPlayers(playersResponse.data || []);
    } catch (error) {
      toast.error("Error al cargar equipos");
    } finally {
      setLoading(false);
    }
  };

  const getTeamPlayers = (teamId: string) => {
    return players.filter((p) => p.team_id === teamId).map((p) => p.name);
  };

  const getCategoryColor = (category: Team["category"]) => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };

  const getAgeCategoryLabel = (ageCategory: Team["age_category"]) => {
    return ageCategory === "SUB_16" ? "Sub 16" : "Libre";
  };

  const categories = ["Femenino", "Masculino"] as const;
  type AgeCategory = "SUB_16" | "LIBRE";
  const ageCategories: AgeCategory[] = ["LIBRE", "SUB_16"];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground/80">Cargando equipos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Equipos</h1>
          <p className="text-foreground/80 text-lg mb-4">
            Conoce a todos los equipos participantes del torneo
          </p>

          {!selectedLeague && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecciona una liga o evento desde el menú superior para ver los equipos
              </AlertDescription>
            </Alert>
          )}

          {teams.length === 0 ? (
            <Card className="gradient-card">
              <CardContent className="py-12 text-center">
                <p className="text-foreground/80">
                  No hay equipos registrados aún
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category} className="space-y-6">
                  <h2 className="text-3xl font-bold">{category}</h2>
                  {ageCategories.map((ageCategory) => {
                    const categoryTeams = teams.filter(
                      (team) => team.category === category && team.age_category === ageCategory
                    );

                    if (categoryTeams.length === 0) return null;

                    return (
                      <div key={`${category}-${ageCategory}`} className="space-y-4">
                        <h3 className="text-2xl font-semibold text-foreground/80">
                          {getAgeCategoryLabel(ageCategory)}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryTeams.map((team) => {
                            const teamPlayers = getTeamPlayers(team.id);
                            return (
                              <Card key={team.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 gradient-card">
                                <CardHeader className="text-center">
                                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                    <img 
                                      src={team.logo_url || teamPlaceholder} 
                                      alt={`Logo de ${team.name}`}
                                      className="w-24 h-24 object-contain"
                                    />
                                  </div>
                                  <CardTitle className="text-xl">{team.name}</CardTitle>
                                  <div className="flex gap-2 mt-2 justify-center">
                                    <Badge className={getCategoryColor(team.category)}>
                                      {team.category}
                                    </Badge>
                                    <Badge variant="outline">
                                      {getAgeCategoryLabel(team.age_category)}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  {teamPlayers.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-3 text-sm text-foreground/80 uppercase tracking-wide">
                                        Plantel
                                      </h4>
                                      <ul className="space-y-2">
                                        {teamPlayers.map((player, index) => (
                                          <li key={index} className="text-sm flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                              {index + 1}
                                            </span>
                                            {player}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Equipos;
