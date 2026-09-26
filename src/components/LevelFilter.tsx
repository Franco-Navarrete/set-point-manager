import { cn } from "@/lib/utils";
import type { LeagueLevel } from "@/hooks/useLeagueLevels";

interface Props {
  levels: LeagueLevel[];
  value: string;
  onChange: (v: string) => void;
}

const LevelFilter = ({ levels, value, onChange }: Props) => {
  if (levels.length === 0) return null;
  const options = levels;
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Nivel">
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
            value === o.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary/60"
          )}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
};

export default LevelFilter;
