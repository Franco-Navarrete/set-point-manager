import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { formatShortDate, type HomeNews } from "@/hooks/useHomeData";

const LatestNewsSection = ({ news }: { news: HomeNews[] }) => (
  <section className="py-8 sm:py-12">
    <div className="container mx-auto px-4">
      <SectionHeader
        icon={Newspaper}
        title="Últimas noticias"
        actionLabel="Ver todas"
        actionTo="/noticias"
      />

      {news.length === 0 ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-center text-foreground/80 text-sm sm:text-base">
            Todavía no hay noticias publicadas.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Card key={n.id} className="gradient-card border-border/50 h-full">
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[11px]">{n.category}</Badge>
                  <span className="text-[11px] text-foreground/70">{formatShortDate(n.date)}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg leading-snug mb-2">{n.title}</h3>
                <p className="text-sm text-foreground/80 line-clamp-4">{n.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default LatestNewsSection;
