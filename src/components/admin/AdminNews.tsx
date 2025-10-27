import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

export const AdminNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState({
    title: "",
    summary: "",
    date: new Date().toISOString().split("T")[0],
    category: "Torneo",
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      toast.error("Error al cargar noticias");
    } else {
      setNews(data || []);
    }
  };

  const createNews = async () => {
    if (!newNews.title || !newNews.summary) {
      toast.error("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("news")
      .insert([newNews]);

    if (error) {
      toast.error("Error al crear noticia");
    } else {
      toast.success("Noticia creada");
      setNewNews({
        title: "",
        summary: "",
        date: new Date().toISOString().split("T")[0],
        category: "Torneo",
      });
      loadNews();
    }
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar noticia");
    } else {
      toast.success("Noticia eliminada");
      loadNews();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Crear Nueva Noticia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
          />
          <Textarea
            placeholder="Resumen de la noticia"
            value={newNews.summary}
            onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
            rows={4}
          />
          <Input
            type="date"
            value={newNews.date}
            onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
          />
          <Select
            value={newNews.category}
            onValueChange={(value) => setNewNews({ ...newNews, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Torneo">Torneo</SelectItem>
              <SelectItem value="Resultados">Resultados</SelectItem>
              <SelectItem value="Comunicados">Comunicados</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createNews} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear Noticia
          </Button>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Noticias Publicadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.date} • {item.category}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNews(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
