import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, MapPin, Volleyball } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { ageLabel, formatLongDate, type HomeMatch } from "@/hooks/useHomeData";

interface Props {
  match: HomeMatch | null;
  leagueName: string | null;
  teamName: (id: string) => string;
  teamLogo: (id: string) => string | null;
}

const TeamSide = ({ name, logo }: { name: string; logo: string | null }) => (
  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
    {logo ? (
      <img src={logo} alt={name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" loading="lazy" />
    ) : (
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Volleyball className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
      </div>
    )}
    <span className="text-sm sm:text-lg font-bold uppercase text-center leading-tight break-words w-full">
      {name}
    </span>
  </div>
);

const NextMatchSection = ({ match, leagueName, teamName, teamLogo }: Props) => (
  <section className="py-8 sm:py-12">
    <div className="container mx-auto px-4">
      <SectionHeader icon={CalendarClock} title="Próximo partido" />

      {!match ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-center text-foreground/80 text-sm sm:text-base">
            No hay partidos programados actualmente.
          </CardContent>
        </Card>
      ) : (
        <Card className="gradient-card border-primary/30 shadow-card overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {leagueName && <Badge variant="secondary" className="text-xs">{leagueName}</Badge>}
              <Badge variant="outline" className="text-xs">{match.category}</Badge>
              <Badge variant="outline" className="text-xs">{ageLabel(match.age_category)}</Badge>
              <Badge className="text-xs">Programado</Badge>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <TeamSide name={teamName(match.team_a_id)} logo={teamLogo(match.team_a_id)} />
              <span className="text-xs sm:text-base font-bold text-primary shrink-0 px-1">VS</span>
              <TeamSide name={teamName(match.team_b_id)} logo={teamLogo(match.team_b_id)} />
            </div>

            <div className="mt-5 space-y-2 text-sm text-foreground/80">
              <p className="flex items-center gap-2 capitalize">
                <CalendarClock className="w-4 h-4 text-primary shrink-0" />
                {formatLongDate(match.date)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {match.time}
              </p>
              {match.venue && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="break-words">{match.venue}</span>
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Link to="/fixture" className="flex-1">
                <Button className="w-full h-11">Ver partido</Button>
              </Link>
              {(match.venue_maps_url || match.venue) && (
                <a
                  href={
                    match.venue_maps_url ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue || "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-11">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver mapa
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </section>
);

export default NextMatchSection;
