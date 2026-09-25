import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface Team { id: string; name: string; category: string; age_category: string; league_id: string | null }
interface League { id: string; name: string }
interface Player { id: string; team_id: string; name: string; position: number }

const ageLabel = (a: string) => (a === "LIBRE" ? "Libre" : a.replace("SUB_", "Sub "));

export const AdminPlayers = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ team_id: "", name: "", dni: "" });
  const [filterTeam, setFilterTeam] = useState("all");

  const load = async () => {
    const [l, t, p] = await Promise.all([
      supabase.from("leagues").select("id,name").order("display_order"),
      supabase.from("teams").select("id,name,category,age_category,league_id").order("name"),
      supabase.from("players").select("*").order("position"),
    ]);
    if (l.error || t.error || p.error) toast.error("No se pudieron cargar los jugadores");
    setLeagues(l.data || []);
    setTeams(t.data || []);
    setPlayers(p.data || []);
  };

  useEffect(() => { load(); }, []);

  const leagueName = (id: string | null) => leagues.find((l) => l.id === id)?.name || "Sin liga";

  const createPlayer = async () => {
    if (!newPlayer.team_id || !newPlayer.name.trim() || !newPlayer.dni.trim()) {
      toast.error("Completa todos los campos (nombre y DNI son obligatorios)");
      return;
    }
    const { error } = await supabase.from("players").insert([{ team_id: newPlayer.team_id, name: newPlayer.name.trim() }]);
    if (error) toast.error("Error al agregar jugador");
    else { toast.success("Jugador agregado"); setNewPlayer({ team_id: "", name: "", dni: "" }); load(); }
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) toast.error("Error al eliminar jugador");
    else { toast.success("Jugador eliminado"); load(); }
  };

  const filtered = filterTeam === "all" ? players : players.filter((p) => p.team_id === filterTeam);

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader><CardTitle className="text-foreground">Agregar Jugador</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Es obligatorio cargar el nombre completo y el DNI del jugador.</p>
          <Select value={newPlayer.team_id} onValueChange={(v) => setNewPlayer({ ...newPlayer, team_id: v })}>
            <SelectTrigger><SelectValue placeholder="Selecciona un equipo" /></SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name} ({t.category} - {ageLabel(t.age_category)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Nombre completo del jugador" value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} />
          <Input placeholder="Número de DNI" value={newPlayer.dni} onChange={(e) => setNewPlayer({ ...newPlayer, dni: e.target.value })} />
          <Button onClick={createPlayer} className="w-full"><Plus className="w-4 h-4 mr-2" />Agregar Jugador</Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-foreground">Jugadores ({filtered.length})</CardTitle>
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los equipos</SelectItem>
              {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((p) => {
            const team = teams.find((t) => t.id === p.team_id);
            return (
              <div key={p.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{team?.name} • {leagueName(team?.league_id || null)}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deletePlayer(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
