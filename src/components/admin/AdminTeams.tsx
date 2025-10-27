import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino" | "Mixto";
  logo_url: string | null;
}

interface Player {
  id: string;
  team_id: string;
  name: string;
  position: number;
}

export const AdminTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", category: "Femenino" as const });
  const [newPlayer, setNewPlayer] = useState({ team_id: "", name: "" });

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

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

  const loadPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("position");
    
    if (error) {
      toast.error("Error al cargar jugadores");
    } else {
      setPlayers(data || []);
    }
  };

  const createTeam = async () => {
    if (!newTeam.name) {
      toast.error("Ingresa el nombre del equipo");
      return;
    }

    const { error } = await supabase
      .from("teams")
      .insert([newTeam]);

    if (error) {
      toast.error("Error al crear equipo");
    } else {
      toast.success("Equipo creado");
      setNewTeam({ name: "", category: "Femenino" });
      loadTeams();
    }
  };

  const deleteTeam = async (id: string) => {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar equipo");
    } else {
      toast.success("Equipo eliminado");
      loadTeams();
      loadPlayers();
    }
  };

  const createPlayer = async () => {
    if (!newPlayer.team_id || !newPlayer.name) {
      toast.error("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("players")
      .insert([newPlayer]);

    if (error) {
      toast.error("Error al agregar jugador");
    } else {
      toast.success("Jugador agregado");
      setNewPlayer({ team_id: "", name: "" });
      loadPlayers();
    }
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar jugador");
    } else {
      toast.success("Jugador eliminado");
      loadPlayers();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Crear Nuevo Equipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nombre del equipo"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <Select
            value={newTeam.category}
            onValueChange={(value: any) => setNewTeam({ ...newTeam, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createTeam} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear Equipo
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Equipos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-sm text-muted-foreground">{team.category}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTeam(team.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Agregar Jugador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={newPlayer.team_id}
            onValueChange={(value) => setNewPlayer({ ...newPlayer, team_id: value })}
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
          <Input
            placeholder="Nombre del jugador"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
          />
          <Button onClick={createPlayer} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Jugador
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {players.map((player) => {
              const team = teams.find((t) => t.id === player.team_id);
              return (
                <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{team?.name}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePlayer(player.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
