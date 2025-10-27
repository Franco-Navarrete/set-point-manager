import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import teamPlaceholder from "@/assets/team-placeholder.png";

interface Team {
  id: number;
  name: string;
  category: "Femenino" | "Masculino" | "Mixto";
  players?: string[];
}

const Equipos = () => {
  const teams: Team[] = [
    {
      id: 1,
      name: "Águilas Voladoras",
      category: "Femenino",
      players: ["María González", "Laura Martínez", "Ana Rodríguez", "Sofía López"],
    },
    {
      id: 2,
      name: "Panteras",
      category: "Femenino",
      players: ["Carmen Díaz", "Patricia Fernández", "Isabel Sánchez", "Rosa Pérez"],
    },
    {
      id: 3,
      name: "Tigres del Norte",
      category: "Femenino",
      players: ["Lucía Torres", "Elena García", "Marta Ruiz", "Clara Moreno"],
    },
    {
      id: 4,
      name: "Leones Azules",
      category: "Masculino",
      players: ["Carlos Ramírez", "Diego Silva", "Javier Núñez", "Miguel Castro"],
    },
    {
      id: 5,
      name: "Halcones FC",
      category: "Masculino",
      players: ["Fernando Ortiz", "Roberto Vega", "Andrés Medina", "Pablo Romero"],
    },
    {
      id: 6,
      name: "Relámpagos",
      category: "Mixto",
      players: ["Alex Jiménez", "Sam Torres", "Jordan Flores", "Chris Morales"],
    },
    {
      id: 7,
      name: "Estrellas Unidas",
      category: "Mixto",
      players: ["Taylor Vargas", "Morgan Reyes", "Casey Herrera", "River Gutiérrez"],
    },
  ];

  const getCategoryColor = (category: Team["category"]) => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Equipos</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Conoce a todos los equipos participantes del torneo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 gradient-card">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={teamPlaceholder} 
                      alt={`Logo de ${team.name}`}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <Badge className={`${getCategoryColor(team.category)} mt-2 mx-auto`}>
                    {team.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  {team.players && team.players.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                        Plantel
                      </h4>
                      <ul className="space-y-2">
                        {team.players.map((player, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {index + 1}
                            </span>
                            {player}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Equipos;
