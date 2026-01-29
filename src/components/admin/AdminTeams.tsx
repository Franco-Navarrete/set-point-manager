import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Plus, Filter, Pencil } from "lucide-react";

interface League {
  id: string;
  name: string;
  type: string;
  logo_url: string | null;
}

interface Team {
  id: string;
  name: string;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
  logo_url: string | null;
  league_id: string | null;
}

interface Player {
  id: string;
  team_id: string;
  name: string;
  position: number;
}

export const AdminTeams = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", category: "Femenino" as const, age_category: "LIBRE" as const, league_id: "", logo_url: "" });
  const [newPlayer, setNewPlayer] = useState({ team_id: "", name: "" });
  const [filterLeague, setFilterLeague] = useState<string>("");
  const [filterTeam, setFilterTeam] = useState<string>("");
  
  // Edit team state
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadLeagues();
    loadTeams();
    loadPlayers();
  }, []);

  const loadLeagues = async () => {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
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
    if (!newTeam.name || !newTeam.league_id) {
      toast.error("Completa todos los campos");
      return;
    }

    const teamData = {
      name: newTeam.name,
      category: newTeam.category,
      age_category: newTeam.age_category,
      league_id: newTeam.league_id,
      logo_url: newTeam.logo_url || null
    };

    const { error } = await supabase
      .from("teams")
      .insert([teamData]);

    if (error) {
      toast.error("Error al crear equipo");
    } else {
      toast.success("Equipo creado");
      setNewTeam({ name: "", category: "Femenino", age_category: "LIBRE", league_id: "", logo_url: "" });
      loadTeams();
    }
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam({ ...team });
    setEditDialogOpen(true);
  };

  const updateTeam = async () => {
    if (!editingTeam) return;

    if (!editingTeam.name || !editingTeam.league_id) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    const { error } = await supabase
      .from("teams")
      .update({
        name: editingTeam.name,
        category: editingTeam.category,
        age_category: editingTeam.age_category,
        league_id: editingTeam.league_id,
        logo_url: editingTeam.logo_url || null
      })
      .eq("id", editingTeam.id);

    if (error) {
      toast.error("Error al actualizar equipo");
    } else {
      toast.success("Equipo actualizado");
      setEditDialogOpen(false);
      setEditingTeam(null);
      loadTeams();
    }
  };

  const getLeagueName = (leagueId: string | null) => {
    if (!leagueId) return "Sin liga";
    return leagues.find(l => l.id === leagueId)?.name || "Desconocida";
  };

  const filteredTeams = filterLeague && filterLeague !== "all"
    ? teams.filter(team => team.league_id === filterLeague)
    : teams;

  const filteredPlayers = players.filter(player => {
    const team = teams.find(t => t.id === player.team_id);
    
    // Filter by league
    if (filterLeague && filterLeague !== "all" && team?.league_id !== filterLeague) {
      return false;
    }
    
    // Filter by team
    if (filterTeam && filterTeam !== "all" && player.team_id !== filterTeam) {
      return false;
    }
    
    return true;
  });

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
      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Equipo</DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Nombre del equipo</label>
                <Input
                  placeholder="Nombre del equipo"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">URL del Logo/Escudo</label>
                <Input
                  placeholder="https://ejemplo.com/logo.png"
                  value={editingTeam.logo_url || ""}
                  onChange={(e) => setEditingTeam({ ...editingTeam, logo_url: e.target.value })}
                />
                {editingTeam.logo_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img 
                      src={editingTeam.logo_url} 
                      alt="Preview" 
                      className="w-12 h-12 object-contain rounded border border-border"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="text-sm text-white/70">Vista previa</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Género</label>
                <Select
                  value={editingTeam.category}
                  onValueChange={(value: "Femenino" | "Masculino") => setEditingTeam({ ...editingTeam, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Categoría de edad</label>
                <Select
                  value={editingTeam.age_category}
                  onValueChange={(value: "SUB_16" | "LIBRE") => setEditingTeam({ ...editingTeam, age_category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUB_16">Sub 16</SelectItem>
                    <SelectItem value="LIBRE">Libre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Liga</label>
                <Select
                  value={editingTeam.league_id || ""}
                  onValueChange={(value) => setEditingTeam({ ...editingTeam, league_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona liga" />
                  </SelectTrigger>
                  <SelectContent>
                    {leagues.map((league) => (
                      <SelectItem key={league.id} value={league.id}>
                        <div className="flex items-center gap-2">
                          {league.logo_url && (
                            <img src={league.logo_url} alt="" className="w-4 h-4 object-contain" />
                          )}
                          {league.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateTeam}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Filtrar por Liga</label>
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
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Filtrar por Equipo</label>
            <Select value={filterTeam || "all"} onValueChange={setFilterTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los equipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
              {filteredTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name} ({team.category} - {team.age_category === "SUB_16" ? "Sub 16" : "Libre"})
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Crear Nuevo Equipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Nombre del equipo</label>
            <Input
              placeholder="Nombre del equipo"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">URL del Logo/Escudo (opcional)</label>
            <Input
              placeholder="https://ejemplo.com/logo.png"
              value={newTeam.logo_url}
              onChange={(e) => setNewTeam({ ...newTeam, logo_url: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Género</label>
            <Select
              value={newTeam.category}
              onValueChange={(value: any) => setNewTeam({ ...newTeam, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Categoría de edad</label>
            <Select
              value={newTeam.age_category}
              onValueChange={(value: any) => setNewTeam({ ...newTeam, age_category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUB_16">Sub 16</SelectItem>
                <SelectItem value="LIBRE">Libre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Liga</label>
            <Select
              value={newTeam.league_id}
              onValueChange={(value) => setNewTeam({ ...newTeam, league_id: value })}
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
          </div>
          <Button onClick={createTeam} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear Equipo
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Equipos Existentes ({filteredTeams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {team.logo_url ? (
                    <img 
                      src={team.logo_url} 
                      alt={team.name}
                      className="w-10 h-10 object-contain rounded"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-background/50 rounded flex items-center justify-center text-muted-foreground text-xs">
                      Sin logo
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.category} • {team.age_category === "SUB_16" ? "Sub 16" : "Libre"} • {getLeagueName(team.league_id)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(team)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTeam(team.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Agregar Jugador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Equipo</label>
            <Select
              value={newPlayer.team_id}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, team_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {filteredTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} ({team.category} - {team.age_category === "SUB_16" ? "Sub 16" : "Libre"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Nombre del jugador</label>
            <Input
              placeholder="Nombre del jugador"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />
          </div>
          <Button onClick={createPlayer} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Jugador
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Jugadores ({filteredPlayers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredPlayers.map((player) => {
              const team = teams.find((t) => t.id === player.team_id);
              return (
                <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {team?.name} • {getLeagueName(team?.league_id || null)}
                    </p>
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
