import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Check, Pencil, X } from "lucide-react";
import { useLeagueLevels } from "@/hooks/useLeagueLevels";

export const AdminLevels = ({ leagues }: { leagues: { id: string; name: string }[] }) => {
  const [leagueId, setLeagueId] = useState("");
  const { levels, reload } = useLeagueLevels(leagueId);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (!leagueId && leagues.length) setLeagueId(leagues[0].id);
  }, [leagues, leagueId]);

  const add = async () => {
    const n = name.trim();
    if (!leagueId || !n) return toast.error("Elegí una liga y escribí el nombre del nivel.");
    const { error } = await supabase.from("league_levels").insert({ league_id: leagueId, name: n, display_order: levels.length });
    if (error) return toast.error("No se pudo crear el nivel.");
    toast.success("Nivel creado");
    setName("");
    reload();
  };

  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    const { error } = await supabase.from("league_levels").update({ name: editName.trim() }).eq("id", editId);
    if (error) return toast.error("No se pudo actualizar el nivel.");
    setEditId(null);
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este nivel? Los equipos quedarán sin nivel asignado.")) return;
    const { error } = await supabase.from("league_levels").delete().eq("id", id);
    if (error) return toast.error("No se pudo eliminar el nivel.");
    toast.success("Nivel eliminado");
    reload();
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-foreground">Niveles de la liga</CardTitle>
        <p className="text-sm text-muted-foreground">Dividí una liga en niveles (ej. Nivel 1, Nivel 2) y asigná los equipos desde "Equipos".</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Liga</Label>
          <Select value={leagueId} onValueChange={setLeagueId}>
            <SelectTrigger><SelectValue placeholder="Selecciona liga" /></SelectTrigger>
            <SelectContent>{leagues.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Nombre del nivel (ej. Nivel 1)" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Button onClick={add}><Plus className="w-4 h-4 mr-1" />Agregar</Button>
        </div>
        {levels.length === 0 ? (
          <p className="text-sm text-muted-foreground">Esta liga no tiene niveles.</p>
        ) : (
          <ul className="space-y-2">
            {levels.map((lv) => (
              <li key={lv.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background">
                {editId === lv.id ? (
                  <>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                    <Button size="sm" onClick={saveEdit}><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-foreground">{lv.name}</span>
                    <Button size="sm" variant="outline" onClick={() => { setEditId(lv.id); setEditName(lv.name); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(lv.id)}><Trash2 className="w-4 h-4" /></Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
