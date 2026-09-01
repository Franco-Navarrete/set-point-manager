import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface Row {
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
}

const StandingsPreviewSection = ({ rows }: { rows: Row[] }) => (
  <section className="py-8 sm:py-12">
    <div className="container mx-auto px-4">
      <SectionHeader
        icon={BarChart3}
        title="Tabla de posiciones"
        actionLabel="Tabla completa"
        actionTo="/tabla"
      />

      <Card className="gradient-card border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-center text-foreground/80 text-sm sm:text-base">
              Aún no hay posiciones disponibles.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-foreground/70">
                <tr>
                  <th className="py-2 px-2 sm:px-4 text-left w-8">#</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Equipo</th>
                  <th className="py-2 px-1 sm:px-3 text-center">PJ</th>
                  <th className="py-2 px-1 sm:px-3 text-center">G</th>
                  <th className="py-2 px-1 sm:px-3 text-center">P</th>
                  <th className="py-2 px-2 sm:px-4 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={r.team + i} className="border-t border-border/60">
                    <td className="py-2.5 px-2 sm:px-4 font-bold text-primary">{i + 1}</td>
                    <td className="py-2.5 px-2 sm:px-4 font-semibold">{r.team}</td>
                    <td className="py-2.5 px-1 sm:px-3 text-center tabular-nums">{r.played}</td>
                    <td className="py-2.5 px-1 sm:px-3 text-center tabular-nums">{r.won}</td>
                    <td className="py-2.5 px-1 sm:px-3 text-center tabular-nums">{r.lost}</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center font-bold tabular-nums">{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  </section>
);

export default StandingsPreviewSection;
