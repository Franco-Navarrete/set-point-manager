import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AdminTeams } from "@/components/admin/AdminTeams";
import { AdminMatches } from "@/components/admin/AdminMatches";
import { AdminNews } from "@/components/admin/AdminNews";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminLeagues } from "@/components/admin/AdminLeagues";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (error || !data) {
        toast.error("No tienes permisos de administrador");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Panel Administrativo</h1>
          <p className="text-foreground/70 text-lg mb-8">
            Gestiona todos los aspectos de la liga
          </p>

          <Tabs defaultValue="leagues" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="leagues">Ligas</TabsTrigger>
              <TabsTrigger value="teams">Equipos</TabsTrigger>
              <TabsTrigger value="matches">Fixture</TabsTrigger>
              <TabsTrigger value="news">Noticias</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="leagues">
              <AdminLeagues />
            </TabsContent>

            <TabsContent value="teams">
              <AdminTeams />
            </TabsContent>

            <TabsContent value="matches">
              <AdminMatches />
            </TabsContent>

            <TabsContent value="news">
              <AdminNews />
            </TabsContent>

            <TabsContent value="stats">
              <AdminStats />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
