-- Add logo_url column to leagues table
ALTER TABLE public.leagues
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update existing leagues with logos
UPDATE public.leagues SET logo_url = '/leagues/liga-noreste.png', display_order = 1 WHERE name LIKE '%Noreste%';
UPDATE public.leagues SET logo_url = '/leagues/liga-regional-norte.png', display_order = 2 WHERE name LIKE '%Regional del Norte%';
UPDATE public.leagues SET logo_url = '/leagues/sierras-chicas.png', display_order = 3 WHERE name LIKE '%Sierras Chicas%';
UPDATE public.leagues SET logo_url = '/leagues/paravachasca.png', display_order = 4 WHERE name LIKE '%Paravachasca%';
UPDATE public.leagues SET logo_url = '/leagues/liga-beach-voley.png', display_order = 5 WHERE name LIKE '%Beach%';
UPDATE public.leagues SET logo_url = '/leagues/la-docta.png', display_order = 6 WHERE name LIKE '%Docta%';
UPDATE public.leagues SET logo_url = '/leagues/lvp-punilla.png', display_order = 7 WHERE name LIKE '%Punilla%';
UPDATE public.leagues SET logo_url = '/leagues/liga-centro.png', display_order = 8 WHERE name LIKE '%Centro%';

-- Insert any leagues that don't exist yet
INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Liga Noreste de Voley', 'LIGA', '/leagues/liga-noreste.png', 1
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Noreste%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Liga Regional del Norte', 'LIGA', '/leagues/liga-regional-norte.png', 2
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Regional del Norte%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Sierras Chicas Voley', 'LIGA', '/leagues/sierras-chicas.png', 3
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Sierras Chicas%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Paravachasca', 'LIGA', '/leagues/paravachasca.png', 4
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Paravachasca%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Krhonos Liga Beach Voley', 'EVENTO_GRANDE', '/leagues/liga-beach-voley.png', 5
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Beach%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'La Docta Voley - Liga Cordobesa', 'LIGA', '/leagues/la-docta.png', 6
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Docta%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'LVP - Liga de Vóley Valle de Punilla', 'LIGA', '/leagues/lvp-punilla.png', 7
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Punilla%');

INSERT INTO public.leagues (name, type, logo_url, display_order) 
SELECT 'Liga del Centro Voley', 'LIGA', '/leagues/liga-centro.png', 8
WHERE NOT EXISTS (SELECT 1 FROM public.leagues WHERE name LIKE '%Centro%');