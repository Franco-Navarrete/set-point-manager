import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLeague } from "@/contexts/LeagueContext";

export interface HomeMatch {
  id: string;
  date: string;
  time: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
  jornada: number;
  venue: string | null;
  venue_maps_url: string | null;
  league_id: string | null;
}

export interface HomeTeam {
  id: string;
  name: string;
  logo_url: string | null;
  category: "Femenino" | "Masculino";
  age_category: "SUB_16" | "LIBRE";
}

export interface HomeStat {
  team_id: string;
  played: number;
  won: number;
  lost: number;
  sets_for: number;
  sets_against: number;
  points: number;
}

export interface HomeNews {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * Carga los datos reales del panel administrativo para la Home.
 * Todo se filtra por la liga seleccionada (si hay una).
 */
export const useHomeData = () => {
  const { selectedLeague } = useLeague();
  const leagueId = selectedLeague?.id ?? null;

  const [matches, setMatches] = useState<HomeMatch[]>([]);
  const [teams, setTeams] = useState<HomeTeam[]>([]);
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [news, setNews] = useState<HomeNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      let matchesQuery = supabase.from("matches").select("*").order("date");
      let teamsQuery = supabase.from("teams").select("id, name, logo_url, category, age_category");
      let newsQuery = supabase
        .from("news")
        .select("id, title, summary, date, category")
        .order("date", { ascending: false })
        .limit(3);

      if (leagueId) {
        matchesQuery = matchesQuery.eq("league_id", leagueId);
        teamsQuery = teamsQuery.eq("league_id", leagueId);
        newsQuery = newsQuery.eq("league_id", leagueId);
      }

      const [m, t, s, n] = await Promise.all([
        matchesQuery,
        teamsQuery,
        supabase.from("team_stats").select("team_id, played, won, lost, sets_for, sets_against, points"),
        newsQuery,
      ]);

      if (cancelled) return;

      setMatches((m.data as HomeMatch[]) || []);
      setTeams((t.data as HomeTeam[]) || []);
      setStats((s.data as HomeStat[]) || []);
      setNews((n.data as HomeNews[]) || []);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("home-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "team_stats" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "news" }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [leagueId]);

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name || "Equipo";
  const teamLogo = (id: string) => teams.find((t) => t.id === id)?.logo_url || null;

  const today = todayStr();
  const finished = matches.filter((m) => m.score_a !== null && m.score_b !== null);
  const upcoming = matches
    .filter((m) => m.score_a === null && m.score_b === null && m.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const nextMatch = upcoming[0] ?? null;

  const lastResults = [...finished]
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 3);

  const nextRoundDate = nextMatch?.date ?? null;
  const nextRoundMatches = nextRoundDate
    ? upcoming.filter((m) => m.date === nextRoundDate).sort((a, b) => a.time.localeCompare(b.time))
    : [];

  const standings = teams
    .map((team) => {
      const stat = stats.find((s) => s.team_id === team.id);
      return {
        team: team.name,
        logo_url: team.logo_url,
        category: team.category,
        age_category: team.age_category,
        played: stat?.played ?? 0,
        won: stat?.won ?? 0,
        lost: stat?.lost ?? 0,
        points: stat?.points ?? 0,
        setsFor: stat?.sets_for ?? 0,
        setsAgainst: stat?.sets_against ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.setsFor - b.setsAgainst - (a.setsFor - a.setsAgainst) ||
        a.team.localeCompare(b.team)
    );

  return {
    loading,
    hasLeague: !!leagueId,
    leagueName: selectedLeague?.name ?? null,
    matches,
    teams,
    news,
    nextMatch,
    lastResults,
    nextRoundDate,
    nextRoundMatches,
    standings,
    teamName,
    teamLogo,
  };
};

export const formatLongDate = (dateStr: string) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const formatShortDate = (dateStr: string) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const ageLabel = (age: "SUB_16" | "LIBRE") => (age === "SUB_16" ? "Sub 16" : "Libre");
