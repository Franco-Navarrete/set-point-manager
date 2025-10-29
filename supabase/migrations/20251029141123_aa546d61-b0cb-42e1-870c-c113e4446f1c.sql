-- Crear enum para tipos de liga
CREATE TYPE public.league_type AS ENUM ('LIGA', 'EVENTO_GRANDE', 'EVENTO_2DO_ORDEN');

-- Tabla de ligas/eventos
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type league_type NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver ligas"
  ON public.leagues FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear ligas"
  ON public.leagues FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar ligas"
  ON public.leagues FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar ligas"
  ON public.leagues FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Agregar columna league_id a las tablas existentes
ALTER TABLE public.teams ADD COLUMN league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL;
ALTER TABLE public.matches ADD COLUMN league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL;
ALTER TABLE public.news ADD COLUMN league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL;

-- Crear índices para mejorar performance
CREATE INDEX idx_teams_league_id ON public.teams(league_id);
CREATE INDEX idx_matches_league_id ON public.matches(league_id);
CREATE INDEX idx_news_league_id ON public.news(league_id);
CREATE INDEX idx_leagues_type ON public.leagues(type);
CREATE INDEX idx_leagues_active ON public.leagues(is_active);

-- Trigger para actualizar updated_at en leagues
CREATE TRIGGER update_leagues_updated_at
  BEFORE UPDATE ON public.leagues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar las ligas predefinidas
INSERT INTO public.leagues (name, type, display_order) VALUES
  -- LIGAS
  ('La Docta, Liga Cordobesa', 'LIGA', 1),
  ('Liga del Centro', 'LIGA', 2),
  ('Sierras Chicas', 'LIGA', 3),
  ('Liga del Valle de Punilla', 'LIGA', 4),
  ('Liga del Noreste', 'LIGA', 5),
  ('Liga Paravachasca', 'LIGA', 6),
  ('Liga Regional del Norte', 'LIGA', 7),
  ('Krhonos, Liga Beach Vóley', 'LIGA', 8),
  -- EVENTOS GRANDES
  ('COPAS ARGENTINAS AMATEUR', 'EVENTO_GRANDE', 9),
  ('SUPER COPA', 'EVENTO_GRANDE', 10),
  ('SUPER LIGA', 'EVENTO_GRANDE', 11),
  ('INTERASOCIATIVO SELECCIONES', 'EVENTO_GRANDE', 12),
  -- EVENTOS 2do ORDEN
  ('SUPER 4', 'EVENTO_2DO_ORDEN', 13),
  ('TORNEO COMERCIAL', 'EVENTO_2DO_ORDEN', 14),
  ('TORNEO EMPRESARIAL', 'EVENTO_2DO_ORDEN', 15),
  ('MIXTOS', 'EVENTO_2DO_ORDEN', 16);