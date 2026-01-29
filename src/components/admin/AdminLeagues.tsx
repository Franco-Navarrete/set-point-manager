import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface League {
  id: string;
  name: string;
  type: "LIGA" | "EVENTO_GRANDE" | "EVENTO_2DO_ORDEN";
  description: string | null;
  is_active: boolean;
  display_order: number;
}

export const AdminLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<League>>({});
  const [newLeague, setNewLeague] = useState({
    name: "",
    type: "LIGA" as const,
    description: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Error al cargar ligas");
    } else {
      setLeagues(data || []);
    }
  };

  const createLeague = async () => {
    if (!newLeague.name) {
      toast.error("Ingresa el nombre de la liga/evento");
      return;
    }

    const { error } = await supabase.from("leagues").insert([newLeague]);

    if (error) {
      toast.error("Error al crear liga");
    } else {
      toast.success("Liga creada");
      setNewLeague({ name: "", type: "LIGA", description: "", is_active: true, display_order: 0 });
      loadLeagues();
    }
  };

  const startEdit = (league: League) => {
    setEditingId(league.id);
    setEditData(league);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("leagues")
      .update(editData)
      .eq("id", editingId);

    if (error) {
      toast.error("Error al actualizar liga");
    } else {
      toast.success("Liga actualizada");
      setEditingId(null);
      setEditData({});
      loadLeagues();
    }
  };

  const deleteLeague = async (id: string) => {
    const { error } = await supabase.from("leagues").delete().eq("id", id);

    if (error) {
      toast.error("Error al eliminar liga");
    } else {
      toast.success("Liga eliminada");
      loadLeagues();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "LIGA":
        return "Liga";
      case "EVENTO_GRANDE":
        return "Evento Grande";
      case "EVENTO_2DO_ORDEN":
        return "Evento 2do Orden";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-black">Crear Nueva Liga/Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-black">Nombre</Label>
            <Input
              placeholder="Nombre de la liga o evento"
              value={newLeague.name}
              onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-black">Tipo</Label>
            <Select
              value={newLeague.type}
              onValueChange={(value: any) => setNewLeague({ ...newLeague, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIGA">Liga</SelectItem>
                <SelectItem value="EVENTO_GRANDE">Evento Grande</SelectItem>
                <SelectItem value="EVENTO_2DO_ORDEN">Evento 2do Orden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-black">Descripción (opcional)</Label>
            <Textarea
              placeholder="Descripción de la liga o evento"
              value={newLeague.description}
              onChange={(e) => setNewLeague({ ...newLeague, description: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={newLeague.is_active}
              onCheckedChange={(checked) => setNewLeague({ ...newLeague, is_active: checked })}
            />
            <Label className="text-black">Activa</Label>
          </div>
          <div>
            <Label className="text-black">Orden de visualización</Label>
            <Input
              type="number"
              value={newLeague.display_order}
              onChange={(e) => setNewLeague({ ...newLeague, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Button onClick={createLeague}>Crear Liga/Evento</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ligas y Eventos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activa</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues.map((league) =>
                editingId === league.id ? (
                  <TableRow key={league.id}>
                    <TableCell>
                      <Input
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editData.type || league.type}
                        onValueChange={(value: any) => setEditData({ ...editData, type: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LIGA">Liga</SelectItem>
                          <SelectItem value="EVENTO_GRANDE">Evento Grande</SelectItem>
                          <SelectItem value="EVENTO_2DO_ORDEN">Evento 2do Orden</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={editData.is_active ?? league.is_active}
                        onCheckedChange={(checked) => setEditData({ ...editData, is_active: checked })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-20"
                        value={editData.display_order ?? league.display_order}
                        onChange={(e) =>
                          setEditData({ ...editData, display_order: parseInt(e.target.value) || 0 })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={league.id}>
                    <TableCell className="font-medium">{league.name}</TableCell>
                    <TableCell>{getTypeLabel(league.type)}</TableCell>
                    <TableCell>
                      <span className={league.is_active ? "text-green-600" : "text-red-600"}>
                        {league.is_active ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>{league.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => startEdit(league)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteLeague(league.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
