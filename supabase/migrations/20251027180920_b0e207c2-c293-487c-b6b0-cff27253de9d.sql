-- Crear enum para categorías
CREATE TYPE public.category_type AS ENUM ('Femenino', 'Masculino', 'Mixto');

-- Crear enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Función para verificar si un usuario tiene un rol
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabla de equipos
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category category_type NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver equipos"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear equipos"
  ON public.teams FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar equipos"
  ON public.teams FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar equipos"
  ON public.teams FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de jugadores
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver jugadores"
  ON public.players FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear jugadores"
  ON public.players FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar jugadores"
  ON public.players FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar jugadores"
  ON public.players FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de partidos
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  team_a_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  team_b_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  score_a INTEGER,
  score_b INTEGER,
  category category_type NOT NULL,
  jornada INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver partidos"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear partidos"
  ON public.matches FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar partidos"
  ON public.matches FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar partidos"
  ON public.matches FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de noticias
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver noticias"
  ON public.news FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear noticias"
  ON public.news FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar noticias"
  ON public.news FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar noticias"
  ON public.news FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de estadísticas de equipos
CREATE TABLE public.team_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL UNIQUE,
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  sets_for INTEGER NOT NULL DEFAULT 0,
  sets_against INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver estadísticas"
  ON public.team_stats FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear estadísticas"
  ON public.team_stats FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar estadísticas"
  ON public.team_stats FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden eliminar estadísticas"
  ON public.team_stats FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_stats_updated_at
  BEFORE UPDATE ON public.team_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();