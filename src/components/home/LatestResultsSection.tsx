import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { ageLabel, formatShortDate, type HomeMatch } from "@/hooks/useHomeData";

interface Props {
  results: HomeMatch[];
  teamName: (id: string) => string;
}

const LatestResultsSection = ({ results, teamName }: Props) => (
  <section className="py-8 sm:py-12 bg-muted/30">
    <div className="container mx-auto px-4">
      <SectionHeader
        icon={Trophy}
        title="Últimos resultados"
        actionLabel="Ver todos"
        actionTo="/fixture"
      />

      {results.length === 0 ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-center text-foreground/80 text-sm sm:text-base">
            Todavía no hay resultados cargados.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((m) => {
            const aWon = (m.score_a ?? 0) > (m.score_b ?? 0);
            return (
              <Card key={m.id} className="gradient-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`flex-1 text-sm font-semibold uppercase leading-tight ${aWon ? "text-primary" : ""}`}
                    >
                      {teamName(m.team_a_id)}
                    </span>
                    <span className="text-base sm:text-lg font-bold shrink-0 tabular-nums">
                      {m.score_a} - {m.score_b}
                    </span>
                    <span
                      className={`flex-1 text-right text-sm font-semibold uppercase leading-tight ${!aWon ? "text-primary" : ""}`}
                    >
                      {teamName(m.team_b_id)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">{m.category}</Badge>
                    <Badge variant="outline" className="text-[11px]">{ageLabel(m.age_category)}</Badge>
                    <span className="text-[11px] text-foreground/70 ml-auto">{formatShortDate(m.date)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  </section>
);

export default LatestResultsSection;
