import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useLeagueLevels } from "@/hooks/useLeagueLevels";
import { Plus, Pencil, MoreVertical, Trash2, Search, Volleyball, AlertTriangle, Loader2 } from "lucide-react";

type Gender = "Femenino" | "Masculino" | "Mixto";
type AgeCat = "SUB_12" | "SUB_14" | "SUB_16" | "SUB_18" | "LIBRE";

interface League { id: string; name: string; logo_url: string | null }
interface Team {
  id: string;
  name: string;
  category: Gender;
  age_category: AgeCat;
  logo_url: string | null;
  league_id: string | null;
  level_id: string | null;
}

const GENDERS: Gender[] = ["Femenino", "Masculino", "Mixto"];
const AGES: AgeCat[] = ["SUB_12", "SUB_14", "SUB_16", "SUB_18", "LIBRE"];
const ageLabel = (a: string) => (a === "LIBRE" ? "Libre" : a.replace("SUB_", "Sub "));

type FormState = { id?: string; name: string; category: Gender | ""; age_category: AgeCat | ""; league_id: string; level_id: string; logo_url: string };
const emptyForm: FormState = { name: "", category: "", age_category: "", league_id: "", level_id: "", logo_url: "" };

const TeamLogo = ({ url, name, size = "md" }: { url: string | null; name: string; size?: "md" | "lg" }) => {
  const [broken, setBroken] = useState(false);
  const dim = size === "lg" ? "w-16 h-16" : "w-14 h-14";
  return (
    <div className={`${dim} shrink-0 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden`}>
      {url && !broken ? (
        <img src={url} alt={name} className="w-full h-full object-contain p-1.5" onError={() => setBroken(true)} />
      ) : (
        <Volleyball className="w-6 h-6 text-muted-foreground" />
      )}
    </div>
  );
};

export const AdminTeams = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fLeague, setFLeague] = useState("all");
  const [fGender, setFGender] = useState("all");
  const [fAge, setFAge] = useState("all");
  const [fLevel, setFLevel] = useState("all");
  const { levels: filterLevels } = useLeagueLevels(fLeague !== "all" ? fLeague : "");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { levels: formLevels } = useLeagueLevels(form.league_id);
  const [allLevels, setAllLevels] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => { supabase.from("league_levels").select("id,name").then(({ data }) => setAllLevels(data || [])); }, [formOpen]);
  const levelName = (id: string | null) => allLevels.find((l) => l.id === id)?.name;

  const [toDelete, setToDelete] = useState<Team | null>(null);
  const [related, setRelated] = useState<{ matches: number; players: number } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const [l, t] = await Promise.all([
      supabase.from("leagues").select("id,name,logo_url").eq("is_active", true).order("display_order"),
      supabase.from("teams").select("*").order("name"),
    ]);
    if (l.error || t.error) toast.error("No se pudieron cargar los equipos. Intentá nuevamente.");
    setLeagues(l.data || []);
    setTeams((t.data as Team[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const leagueName = (id: string | null) => leagues.find((l) => l.id === id)?.name || "Sin liga";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter((t) =>
      (!q || t.name.toLowerCase().includes(q)) &&
      (fLeague === "all" || t.league_id === fLeague) &&
      (fLevel === "all" || (fLevel === "none" ? !t.level_id : t.level_id === fLevel)) &&
      (fGender === "all" || t.category === fGender) &&
      (fAge === "all" || t.age_category === fAge)
    );
  }, [teams, search, fLeague, fLevel, fGender, fAge]);

  const hasFilters = !!search.trim() || fLeague !== "all" || fLevel !== "all" || fGender !== "all" || fAge !== "all";

  const openCreate = () => {
    setForm({ ...emptyForm, league_id: fLeague !== "all" ? fLeague : "", level_id: fLevel !== "all" && fLevel !== "none" ? fLevel : "" });
    setFormOpen(true);
  };
  const openEdit = (t: Team) => {
    setForm({ id: t.id, name: t.name, category: t.category, age_category: t.age_category, league_id: t.league_id || "", level_id: t.level_id || "", logo_url: t.logo_url || "" });
    setFormOpen(true);
  };

  const save = async () => {
    const name = form.name.trim().replace(/\s+/g, " ");
    if (!name || !form.category || !form.age_category || !form.league_id) {
      toast.error("Completá nombre, género, categoría y liga.");
      return;
    }
    if (formLevels.length > 0 && !form.level_id) {
      toast.error("Seleccioná el nivel / división de la liga.");
      return;
    }
    const dup = teams.some((t) => t.id !== form.id && t.name.toLowerCase() === name.toLowerCase() &&
      t.league_id === form.league_id && t.category === form.category && t.age_category === form.age_category);
    if (dup) {
      toast.error("Ya existe un equipo con ese nombre en esa liga y categoría.");
      return;
    }
    setSaving(true);
    const payload = { name, category: form.category, age_category: form.age_category, league_id: form.league_id, level_id: form.level_id || null, logo_url: form.logo_url.trim() || null };
    const { error } = form.id
      ? await supabase.from("teams").update(payload).eq("id", form.id)
      : await supabase.from("teams").insert([payload]);
    setSaving(false);
    if (error) {
      toast.error(form.id ? "No se pudo actualizar el equipo. Intentá nuevamente." : "No se pudo crear el equipo. Intentá nuevamente.");
      return;
    }
    toast.success(form.id ? "Equipo actualizado correctamente." : "Equipo creado correctamente.");
    setFormOpen(false);
    load();
  };

  const askDelete = async (t: Team) => {
    setToDelete(t);
    setRelated(null);
    const [m, p] = await Promise.all([
      supabase.from("matches").select("id", { count: "exact", head: true }).or(`team_a_id.eq.${t.id},team_b_id.eq.${t.id}`),
      supabase.from("players").select("id", { count: "exact", head: true }).eq("team_id", t.id),
    ]);
    setRelated({ matches: m.count || 0, players: p.count || 0 });
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("teams").delete().eq("id", toDelete.id);
    setDeleting(false);
    if (error) {
      toast.error("No se pudo eliminar el equipo. Si tiene partidos cargados, eliminá esos partidos primero.");
      return;
    }
    toast.success("Equipo eliminado correctamente.");
    setToDelete(null);
    load();
  };

  const hasRelated = related && (related.matches > 0 || related.players > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Gestión de equipos</h2>
          <p className="text-muted-foreground mt-1">Administra los equipos registrados en las diferentes ligas.</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Nuevo equipo
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-3 md:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr] gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={fLeague} onValueChange={(v) => { setFLeague(v); setFLevel("all"); }}>
            <SelectTrigger aria-label="Liga"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ligas</SelectItem>
              {leagues.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fLevel} onValueChange={setFLevel} disabled={fLeague === "all"}>
            <SelectTrigger aria-label="Nivel / División"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="none">Sin división</SelectItem>
              {filterLevels.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fGender} onValueChange={setFGender}>
            <SelectTrigger aria-label="Género"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los géneros</SelectItem>
              {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fAge} onValueChange={setFAge}>
            <SelectTrigger aria-label="Categoría"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {AGES.map((a) => <SelectItem key={a} value={a}>{ageLabel(a)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Cargando equipos..." : hasFilters
            ? `${filtered.length} ${filtered.length === 1 ? "equipo encontrado" : "equipos encontrados"}`
            : `${teams.length} ${teams.length === 1 ? "equipo" : "equipos"}`}
        </p>
        {hasFilters && (
          <button className="text-sm text-primary hover:underline" onClick={() => { setSearch(""); setFLeague("all"); setFLevel("all"); setFGender("all"); setFAge("all"); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <Skeleton className="w-14 h-14 rounded-lg" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-14 px-6 text-center">
          <Volleyball className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">No encontramos equipos</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Probá cambiar los filtros o crear un nuevo equipo.</p>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nuevo equipo</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((team) => (
            <div key={team.id} className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card transition-colors hover:border-primary/50 hover:bg-secondary/40">
              <TeamLogo url={team.logo_url} name={team.name} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground leading-tight truncate" title={team.name}>{team.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{team.category} · {ageLabel(team.age_category)}</p>
                <p className="text-xs text-muted-foreground/80 truncate">{leagueName(team.league_id)} · {levelName(team.level_id) || "Sin división"}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEdit(team)}>
                  <Pencil className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Editar</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Más acciones"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(team)}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => askDelete(team)} className="text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{form.id ? "Editar equipo" : "Nuevo equipo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nombre del equipo *</Label>
              <Input id="team-name" placeholder="Ej: Club Ateneo La Puerta" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-logo">Escudo del equipo (URL de la imagen)</Label>
              <div className="flex items-center gap-3">
                <TeamLogo url={form.logo_url.trim() || null} name="Vista previa" size="lg" key={form.logo_url} />
                <div className="flex-1 space-y-1.5">
                  <Input id="team-logo" placeholder="https://ejemplo.com/escudo.png" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
                  {form.logo_url && (
                    <button type="button" className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setForm({ ...form, logo_url: "" })}>Quitar escudo</button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Formatos PNG, JPG o WEBP. Opcional.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Género *</Label>
                <Select value={form.category} onValueChange={(v: Gender) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona género" /></SelectTrigger>
                  <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoría de edad *</Label>
                <Select value={form.age_category} onValueChange={(v: AgeCat) => setForm({ ...form, age_category: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                  <SelectContent>{AGES.map((a) => <SelectItem key={a} value={a}>{ageLabel(a)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Liga *</Label>
                <Select value={form.league_id} onValueChange={(v) => setForm({ ...form, league_id: v, level_id: "" })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona liga" /></SelectTrigger>
                  <SelectContent>{leagues.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel / División{formLevels.length > 0 ? " *" : ""}</Label>
                {formLevels.length > 0 ? (
                  <Select value={form.level_id} onValueChange={(v) => setForm({ ...form, level_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecciona división" /></SelectTrigger>
                    <SelectContent>
                      {formLevels.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value="none" disabled>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="none">Sin división</SelectItem></SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {form.id ? "Guardar cambios" : "Crear equipo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="bg-card border-border w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">¿Eliminar equipo?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará el equipo de la administración. Verificá que sea el equipo correcto antes de continuar.
            </DialogDescription>
          </DialogHeader>
          {toDelete && (
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
              <TeamLogo url={toDelete.logo_url} name={toDelete.name} />
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{toDelete.name}</p>
                <p className="text-sm text-muted-foreground">{toDelete.category} · {ageLabel(toDelete.age_category)}</p>
                <p className="text-xs text-muted-foreground/80">{leagueName(toDelete.league_id)}</p>
              </div>
            </div>
          )}
          {hasRelated && (
            <div className="flex gap-2 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-sm text-foreground">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p>
                Este equipo tiene información asociada ({related!.matches} partido{related!.matches === 1 ? "" : "s"}, {related!.players} jugador{related!.players === 1 ? "" : "es"}). Al eliminarlo podrían verse afectados registros relacionados.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting || !related}>
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar equipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
