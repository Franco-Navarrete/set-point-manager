import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino" | "Mixto";
}

interface TeamStat {
  id: string;
  team_id: string;
  played: number;
  won: number;
  lost: number;
  sets_for: number;
  sets_against: number;
  points: number;
}

interface TeamStanding {
  position: number;
  team: string;
  category: "Femenino" | "Masculino" | "Mixto";
  played: number;
  won: number;
  lost: number;
  setsFor: number;
  setsAgainst: number;
  points: number;
}

const Tabla = () => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    try {
      const [teamsResponse, statsResponse] = await Promise.all([
        supabase.from("teams").select("*"),
        supabase.from("team_stats").select("*"),
      ]);

      if (teamsResponse.error) throw teamsResponse.error;
      if (statsResponse.error) throw statsResponse.error;

      const teams: Team[] = teamsResponse.data || [];
      const stats: TeamStat[] = statsResponse.data || [];

      const combined: TeamStanding[] = teams.map((team) => {
        const stat = stats.find((s) => s.team_id === team.id);
        return {
          position: 0,
          team: team.name,
          category: team.category,
          played: stat?.played || 0,
          won: stat?.won || 0,
          lost: stat?.lost || 0,
          setsFor: stat?.sets_for || 0,
          setsAgainst: stat?.sets_against || 0,
          points: stat?.points || 0,
        };
      });

      setStandings(combined);
    } catch (error) {
      toast.error("Error al cargar tabla de posiciones");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Femenino", "Masculino", "Mixto"] as const;

  const getCategoryColor = (category: typeof categories[number]) => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Mixto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando tabla...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tabla de Posiciones</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Clasificación actual del torneo por categoría
          </p>

          <div className="space-y-8">
            {categories.map((category) => {
              const categoryTeams = standings
                .filter((team) => team.category === category)
                .sort((a, b) => b.points - a.points)
                .map((team, index) => ({ ...team, position: index + 1 }));

              return (
                <Card key={category} className="gradient-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{category}</CardTitle>
                      <Badge className={getCategoryColor(category)}>
                        {categoryTeams.length} equipos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {categoryTeams.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No hay equipos en esta categoría
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16 text-center">Pos</TableHead>
                              <TableHead>Equipo</TableHead>
                              <TableHead className="text-center">PJ</TableHead>
                              <TableHead className="text-center">PG</TableHead>
                              <TableHead className="text-center">PP</TableHead>
                              <TableHead className="text-center">SF</TableHead>
                              <TableHead className="text-center">SC</TableHead>
                              <TableHead className="text-center font-bold">Pts</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoryTeams.map((team) => (
                              <TableRow key={`${team.category}-${team.team}`} className="hover:bg-muted/50">
                                <TableCell className="text-center font-medium">
                                  <div className="flex items-center justify-center gap-1">
                                    {team.position === 1 && (
                                      <Trophy className="w-4 h-4 text-primary" />
                                    )}
                                    {team.position}
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">{team.team}</TableCell>
                                <TableCell className="text-center">{team.played}</TableCell>
                                <TableCell className="text-center text-green-600 dark:text-green-400 font-medium">
                                  {team.won}
                                </TableCell>
                                <TableCell className="text-center text-red-600 dark:text-red-400 font-medium">
                                  {team.lost}
                                </TableCell>
                                <TableCell className="text-center">{team.setsFor}</TableCell>
                                <TableCell className="text-center">{team.setsAgainst}</TableCell>
                                <TableCell className="text-center font-bold text-lg text-primary">
                                  {team.points}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-muted/30">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-3">Leyenda:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div><span className="font-semibold">PJ:</span> Partidos Jugados</div>
                <div><span className="font-semibold">PG:</span> Partidos Ganados</div>
                <div><span className="font-semibold">PP:</span> Partidos Perdidos</div>
                <div><span className="font-semibold">SF:</span> Sets a Favor</div>
                <div><span className="font-semibold">SC:</span> Sets en Contra</div>
                <div><span className="font-semibold">Pts:</span> Puntos</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tabla;
