import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  actionLabel?: string;
  actionTo?: string;
}

const SectionHeader = ({ icon: Icon, title, actionLabel, actionTo }: SectionHeaderProps) => (
  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
    <h2 className="flex items-center gap-2 text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
      {title}
    </h2>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="shrink-0">
        <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm px-2 sm:px-3">
          {actionLabel}
        </Button>
      </Link>
    )}
  </div>
);

export default SectionHeader;
