-- Add venue_maps_url field to matches table for Google Maps integration
ALTER TABLE public.matches 
ADD COLUMN venue_maps_url TEXT;