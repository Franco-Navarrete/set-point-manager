import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeagueLevel {
  id: string;
  league_id: string;
  name: string;
  display_order: number;
}

export const useLeagueLevels = (leagueId: string | null | undefined) => {
  const [levels, setLevels] = useState<LeagueLevel[]>([]);

  const reload = async () => {
    if (!leagueId) { setLevels([]); return; }
    const { data } = await supabase
      .from("league_levels")
      .select("id,league_id,name,display_order")
      .eq("league_id", leagueId)
      .order("display_order")
      .order("name");
    setLevels((data as LeagueLevel[]) || []);
  };

  useEffect(() => { reload(); }, [leagueId]);

  return { levels, reload };
};
