CREATE TABLE public.league_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id uuid NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.league_levels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.league_levels TO authenticated;
GRANT ALL ON public.league_levels TO service_role;
ALTER TABLE public.league_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos pueden ver niveles" ON public.league_levels FOR SELECT USING (true);
CREATE POLICY "Solo admins crean niveles" ON public.league_levels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Solo admins actualizan niveles" ON public.league_levels FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Solo admins eliminan niveles" ON public.league_levels FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_league_levels_updated_at BEFORE UPDATE ON public.league_levels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.teams ADD COLUMN level_id uuid REFERENCES public.league_levels(id) ON DELETE SET NULL;