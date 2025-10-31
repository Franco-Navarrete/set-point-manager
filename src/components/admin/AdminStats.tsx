import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface League {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino";
  league_id: string | null;
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

export const AdminStats = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<TeamStat[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [filterLeague, setFilterLeague] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [newStats, setNewStats] = useState({
    played: 0,
    won: 0,
    lost: 0,
    sets_for: 0,
    sets_against: 0,
    points: 0,
  });

  useEffect(() => {
    loadLeagues();
    loadTeams();
    loadStats();
  }, []);

  const loadLeagues = async () => {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .order("name");
    
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

  const loadStats = async () => {
    const { data, error } = await supabase
      .from("team_stats")
      .select("*");
    
    if (error) {
      toast.error("Error al cargar estadísticas");
    } else {
      setStats(data || []);
    }
  };

  const upsertStats = async () => {
    if (!selectedTeam) {
      toast.error("Selecciona un equipo");
      return;
    }

    const { error } = await supabase
      .from("team_stats")
      .upsert([{ team_id: selectedTeam, ...newStats }], { onConflict: "team_id" });

    if (error) {
      toast.error("Error al actualizar estadísticas");
    } else {
      toast.success("Estadísticas actualizadas");
      loadStats();
    }
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Equipo";
  };

  const getLeagueName = (leagueId: string | null) => {
    if (!leagueId) return "Sin liga";
    return leagues.find((l) => l.id === leagueId)?.name || "Sin liga";
  };

  const filteredTeams = filterLeague && filterLeague !== "all"
    ? teams.filter((team) => team.league_id === filterLeague)
    : teams;

  const filteredStats = stats.filter((stat) => {
    const team = teams.find((t) => t.id === stat.team_id);
    if (!team) return false;
    
    if (filterLeague && filterLeague !== "all" && team.league_id !== filterLeague) return false;
    if (filterTeam && filterTeam !== "all" && stat.team_id !== filterTeam) return false;
    
    return true;
  });

  const loadTeamStats = (teamId: string) => {
    const stat = stats.find((s) => s.team_id === teamId);
    if (stat) {
      setNewStats({
        played: stat.played,
        won: stat.won,
        lost: stat.lost,
        sets_for: stat.sets_for,
        sets_against: stat.sets_against,
        points: stat.points,
      });
    } else {
      setNewStats({
        played: 0,
        won: 0,
        lost: 0,
        sets_for: 0,
        sets_against: 0,
        points: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Actualizar Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedTeam}
            onValueChange={(value) => {
              setSelectedTeam(value);
              loadTeamStats(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un equipo" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Partidos Jugados</label>
              <Input
                type="number"
                value={newStats.played}
                onChange={(e) => setNewStats({ ...newStats, played: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Partidos Ganados</label>
              <Input
                type="number"
                value={newStats.won}
                onChange={(e) => setNewStats({ ...newStats, won: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Partidos Perdidos</label>
              <Input
                type="number"
                value={newStats.lost}
                onChange={(e) => setNewStats({ ...newStats, lost: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Sets a Favor</label>
              <Input
                type="number"
                value={newStats.sets_for}
                onChange={(e) => setNewStats({ ...newStats, sets_for: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Sets en Contra</label>
              <Input
                type="number"
                value={newStats.sets_against}
                onChange={(e) => setNewStats({ ...newStats, sets_against: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Puntos</label>
              <Input
                type="number"
                value={newStats.points}
                onChange={(e) => setNewStats({ ...newStats, points: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <Button onClick={upsertStats} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Estadísticas
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Filtrar por Liga</label>
            <Select value={filterLeague} onValueChange={setFilterLeague}>
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
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Filtrar por Equipo</label>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los equipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {filteredTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Estadísticas Actuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStats.map((stat) => {
              const team = teams.find((t) => t.id === stat.team_id);
              return (
                <div key={stat.id} className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">{getTeamName(stat.team_id)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Liga: {getLeagueName(team?.league_id || null)}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>PJ: {stat.played}</div>
                    <div>PG: {stat.won}</div>
                    <div>PP: {stat.lost}</div>
                    <div>SF: {stat.sets_for}</div>
                    <div>SC: {stat.sets_against}</div>
                    <div className="font-bold">Pts: {stat.points}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
