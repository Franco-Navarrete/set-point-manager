-- Crear enum para categorías de edad
CREATE TYPE age_category_type AS ENUM ('SUB_16', 'LIBRE');

-- Añadir columna age_category a la tabla teams
ALTER TABLE public.teams 
ADD COLUMN age_category age_category_type NOT NULL DEFAULT 'LIBRE';

-- Añadir columna age_category a la tabla matches
ALTER TABLE public.matches 
ADD COLUMN age_category age_category_type NOT NULL DEFAULT 'LIBRE';

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_teams_age_category ON public.teams(age_category);
CREATE INDEX idx_matches_age_category ON public.matches(age_category);