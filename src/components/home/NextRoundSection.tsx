import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { ageLabel, formatLongDate, type HomeMatch } from "@/hooks/useHomeData";

interface Props {
  date: string | null;
  matches: HomeMatch[];
  teamName: (id: string) => string;
}

const NextRoundSection = ({ date, matches, teamName }: Props) => (
  <section className="py-8 sm:py-12 bg-muted/30">
    <div className="container mx-auto px-4">
      <SectionHeader
        icon={CalendarDays}
        title="Próxima fecha"
        actionLabel="Ver fixture"
        actionTo="/fixture"
      />

      {!date || matches.length === 0 ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-center text-foreground/80 text-sm sm:text-base">
            No hay una próxima fecha programada.
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm sm:text-base font-semibold capitalize text-primary">
            {formatLongDate(date)}
          </p>
          <div className="space-y-3">
            {matches.map((m) => (
              <Card key={m.id} className="gradient-card border-border/50">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold uppercase leading-tight">
                      {teamName(m.team_a_id)} <span className="text-primary">vs</span> {teamName(m.team_b_id)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-foreground/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {m.time}
                      </span>
                      {m.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {m.venue}
                        </span>
                      )}
                      <Badge variant="outline" className="text-[11px]">{m.category}</Badge>
                      <Badge variant="outline" className="text-[11px]">{ageLabel(m.age_category)}</Badge>
                    </div>
                  </div>
                  {(m.venue_maps_url || m.venue) && (
                    <a
                      href={
                        m.venue_maps_url ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.venue || "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:shrink-0"
                    >
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <MapPin className="w-4 h-4 mr-2" />
                        Ver mapa
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);

export default NextRoundSection;
