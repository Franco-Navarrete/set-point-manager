import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Trophy } from "lucide-react";

interface TeamStats {
  position: number;
  team: string;
  category: "Femenino" | "Masculino" | "Mixto";
  played: number;
  won: number;
  lost: number;
  setsFor: number;
  setsAgainst: number;
  points: number;
}

const Tabla = () => {
  const standings: TeamStats[] = [
    {
      position: 1,
      team: "Águilas Voladoras",
      category: "Femenino",
      played: 2,
      won: 2,
      lost: 0,
      setsFor: 6,
      setsAgainst: 2,
      points: 6,
    },
    {
      position: 2,
      team: "Panteras",
      category: "Femenino",
      played: 1,
      won: 1,
      lost: 0,
      setsFor: 3,
      setsAgainst: 1,
      points: 3,
    },
    {
      position: 3,
      team: "Tigres del Norte",
      category: "Femenino",
      played: 2,
      won: 0,
      lost: 2,
      setsFor: 2,
      setsAgainst: 6,
      points: 0,
    },
    {
      position: 1,
      team: "Leones Azules",
      category: "Masculino",
      played: 1,
      won: 1,
      lost: 0,
      setsFor: 3,
      setsAgainst: 2,
      points: 3,
    },
    {
      position: 2,
      team: "Halcones FC",
      category: "Masculino",
      played: 1,
      won: 0,
      lost: 1,
      setsFor: 2,
      setsAgainst: 3,
      points: 0,
    },
    {
      position: 1,
      team: "Relámpagos",
      category: "Mixto",
      played: 0,
      won: 0,
      lost: 0,
      setsFor: 0,
      setsAgainst: 0,
      points: 0,
    },
    {
      position: 2,
      team: "Estrellas Unidas",
      category: "Mixto",
      played: 0,
      won: 0,
      lost: 0,
      setsFor: 0,
      setsAgainst: 0,
      points: 0,
    },
  ];

  const categories = ["Femenino", "Masculino", "Mixto"] as const;

  const getCategoryColor = (category: typeof categories[number]) => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Mixto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tabla de Posiciones</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Clasificación actual del torneo por categoría
          </p>

          <div className="space-y-8">
            {categories.map((category) => {
              const categoryTeams = standings
                .filter((team) => team.category === category)
                .sort((a, b) => b.points - a.points);

              return (
                <Card key={category} className="gradient-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{category}</CardTitle>
                      <Badge className={getCategoryColor(category)}>
                        {categoryTeams.length} equipos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16 text-center">Pos</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead className="text-center">PJ</TableHead>
                            <TableHead className="text-center">PG</TableHead>
                            <TableHead className="text-center">PP</TableHead>
                            <TableHead className="text-center">SF</TableHead>
                            <TableHead className="text-center">SC</TableHead>
                            <TableHead className="text-center font-bold">Pts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryTeams.map((team) => (
                            <TableRow key={`${team.category}-${team.team}`} className="hover:bg-muted/50">
                              <TableCell className="text-center font-medium">
                                <div className="flex items-center justify-center gap-1">
                                  {team.position === 1 && (
                                    <Trophy className="w-4 h-4 text-primary" />
                                  )}
                                  {team.position}
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">{team.team}</TableCell>
                              <TableCell className="text-center">{team.played}</TableCell>
                              <TableCell className="text-center text-green-600 dark:text-green-400 font-medium">
                                {team.won}
                              </TableCell>
                              <TableCell className="text-center text-red-600 dark:text-red-400 font-medium">
                                {team.lost}
                              </TableCell>
                              <TableCell className="text-center">{team.setsFor}</TableCell>
                              <TableCell className="text-center">{team.setsAgainst}</TableCell>
                              <TableCell className="text-center font-bold text-lg text-primary">
                                {team.points}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-muted/30">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-3">Leyenda:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div><span className="font-semibold">PJ:</span> Partidos Jugados</div>
                <div><span className="font-semibold">PG:</span> Partidos Ganados</div>
                <div><span className="font-semibold">PP:</span> Partidos Perdidos</div>
                <div><span className="font-semibold">SF:</span> Sets a Favor</div>
                <div><span className="font-semibold">SC:</span> Sets en Contra</div>
                <div><span className="font-semibold">Pts:</span> Puntos</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tabla;
