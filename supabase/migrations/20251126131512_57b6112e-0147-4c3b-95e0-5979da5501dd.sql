-- Enable realtime for team_stats table
ALTER TABLE public.team_stats REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_stats;