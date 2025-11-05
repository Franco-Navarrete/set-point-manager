import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, Filter } from "lucide-react";

interface League {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
  league_id: string | null;
}

interface Match {
  id: string;
  date: string;
  time: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
  jornada: number;
  league_id: string | null;
}

export const AdminMatches = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filterLeague, setFilterLeague] = useState<string>("");
  const [newMatch, setNewMatch] = useState({
    date: "",
    time: "",
    team_a_id: "",
    team_b_id: "",
    category: "Femenino" as const,
    age_category: "LIBRE" as const,
    jornada: 1,
    league_id: "",
  });

  useEffect(() => {
    loadLeagues();
    loadTeams();
    loadMatches();
  }, []);

  const loadLeagues = async () => {
    const { data, error } = await supabase
      .from("leagues")
      .select("id, name")
      .eq("is_active", true)
      .order("display_order");
    
    if (error) {
      toast.error("Error al cargar ligas");
    } else {
      setLeagues(data || []);
    }
  };

  const loadTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("name");
    
    if (error) {
      toast.error("Error al cargar equipos");
    } else {
      setTeams(data || []);
    }
  };

  const loadMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      toast.error("Error al cargar partidos");
    } else {
      setMatches(data || []);
    }
  };

  const createMatch = async () => {
    if (!newMatch.date || !newMatch.time || !newMatch.team_a_id || !newMatch.team_b_id || !newMatch.league_id) {
      toast.error("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("matches")
      .insert([newMatch]);

    if (error) {
      toast.error("Error al crear partido");
    } else {
      toast.success("Partido creado");
      setNewMatch({
        date: "",
        time: "",
        team_a_id: "",
        team_b_id: "",
        category: "Femenino",
        age_category: "LIBRE",
        jornada: 1,
        league_id: "",
      });
      loadMatches();
    }
  };

  const deleteMatch = async (id: string) => {
    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar partido");
    } else {
      toast.success("Partido eliminado");
      loadMatches();
    }
  };

  const updateScore = async (id: string, scoreA: number, scoreB: number) => {
    const { error } = await supabase
      .from("matches")
      .update({ score_a: scoreA, score_b: scoreB })
      .eq("id", id);

    if (error) {
      toast.error("Error al actualizar resultado");
    } else {
      toast.success("Resultado actualizado");
      loadMatches();
    }
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Equipo";
  };

  const getLeagueName = (leagueId: string | null) => {
    if (!leagueId) return "Sin liga";
    return leagues.find(l => l.id === leagueId)?.name || "Desconocida";
  };

  const filteredTeams = filterLeague && filterLeague !== "all"
    ? teams.filter(team => team.league_id === filterLeague)
    : teams;

  const availableTeamsForMatch = filteredTeams.filter((t) => 
    t.category === newMatch.category && t.age_category === newMatch.age_category
  );

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtrar por Liga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterLeague || "all"} onValueChange={setFilterLeague}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las ligas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ligas</SelectItem>
              {leagues.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Crear Nuevo Partido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={newMatch.league_id}
            onValueChange={(value) => setNewMatch({ ...newMatch, league_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona liga" />
            </SelectTrigger>
            <SelectContent>
              {leagues.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={newMatch.date}
              onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
            />
            <Input
              type="time"
              value={newMatch.time}
              onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
            />
          </div>
          <Select
            value={newMatch.category}
            onValueChange={(value: any) => setNewMatch({ ...newMatch, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newMatch.age_category}
            onValueChange={(value: any) => setNewMatch({ ...newMatch, age_category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUB_16">Sub 16</SelectItem>
              <SelectItem value="LIBRE">Libre</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newMatch.team_a_id}
            onValueChange={(value) => setNewMatch({ ...newMatch, team_a_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Equipo A" />
            </SelectTrigger>
            <SelectContent>
              {availableTeamsForMatch.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={newMatch.team_b_id}
            onValueChange={(value) => setNewMatch({ ...newMatch, team_b_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Equipo B" />
            </SelectTrigger>
            <SelectContent>
              {availableTeamsForMatch.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Jornada"
            value={newMatch.jornada}
            onChange={(e) => setNewMatch({ ...newMatch, jornada: parseInt(e.target.value) || 1 })}
          />
          <Button onClick={createMatch} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear Partido
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Partidos Programados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {getTeamName(match.team_a_id)} vs {getTeamName(match.team_b_id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {match.date} • {match.time} • Jornada {match.jornada}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMatch(match.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Score A"
                    defaultValue={match.score_a || ""}
                    onChange={(e) => {
                      const scoreA = parseInt(e.target.value) || 0;
                      const scoreB = match.score_b || 0;
                      updateScore(match.id, scoreA, scoreB);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Score B"
                    defaultValue={match.score_b || ""}
                    onChange={(e) => {
                      const scoreB = parseInt(e.target.value) || 0;
                      const scoreA = match.score_a || 0;
                      updateScore(match.id, scoreA, scoreB);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
