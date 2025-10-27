import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Category = "Todos" | "Femenino" | "Masculino" | "Mixto";

interface Match {
  id: number;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  category: Exclude<Category, "Todos">;
  jornada: number;
}

const Fixture = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");

  const matches: Match[] = [
    {
      id: 1,
      date: "2025-11-05",
      time: "18:00",
      teamA: "Águilas Voladoras",
      teamB: "Tigres del Norte",
      scoreA: 3,
      scoreB: 1,
      category: "Femenino",
      jornada: 1,
    },
    {
      id: 2,
      date: "2025-11-05",
      time: "20:00",
      teamA: "Halcones FC",
      teamB: "Leones Azules",
      scoreA: 2,
      scoreB: 3,
      category: "Masculino",
      jornada: 1,
    },
    {
      id: 3,
      date: "2025-11-12",
      time: "19:00",
      teamA: "Estrellas Unidas",
      teamB: "Relámpagos",
      category: "Mixto",
      jornada: 2,
    },
    {
      id: 4,
      date: "2025-11-12",
      time: "21:00",
      teamA: "Panteras",
      teamB: "Águilas Voladoras",
      category: "Femenino",
      jornada: 2,
    },
    {
      id: 5,
      date: "2025-11-19",
      time: "18:30",
      teamA: "Tigres del Norte",
      teamB: "Halcones FC",
      category: "Masculino",
      jornada: 3,
    },
    {
      id: 6,
      date: "2025-11-19",
      time: "20:30",
      teamA: "Leones Azules",
      teamB: "Relámpagos",
      category: "Mixto",
      jornada: 3,
    },
  ];

  const categories: Category[] = ["Todos", "Femenino", "Masculino", "Mixto"];

  const filteredMatches = selectedCategory === "Todos" 
    ? matches 
    : matches.filter(match => match.category === selectedCategory);

  const getCategoryColor = (category: Exclude<Category, "Todos">) => {
    switch (category) {
      case "Femenino":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Masculino":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Mixto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fixture</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Calendario completo de partidos del torneo
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Matches List */}
          <div className="space-y-6">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-card transition-all duration-300 gradient-card">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="text-lg">
                        Jornada {match.jornada}
                      </CardTitle>
                      <Badge className={getCategoryColor(match.category)}>
                        {match.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formatDate(match.date)} • {match.time}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-lg">{match.teamA}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 px-6 py-3 bg-muted rounded-lg min-w-[120px] justify-center">
                        {match.scoreA !== undefined && match.scoreB !== undefined ? (
                          <>
                            <span className="text-2xl font-bold">{match.scoreA}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-2xl font-bold">{match.scoreB}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground font-medium">VS</span>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-lg">{match.teamB}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="gradient-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No hay partidos programados en esta categoría
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Fixture;
