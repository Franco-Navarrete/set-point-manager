import { useEffect, useState } from 'react';
import { useLeague } from '@/contexts/LeagueContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Star, Award } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type League = Tables<'leagues'>;

const LeagueSelector = () => {
  const { selectedLeague, setSelectedLeague } = useLeague();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching leagues:', error);
    } else {
      setLeagues(data || []);
    }
    setLoading(false);
  };

  const ligas = leagues.filter(l => l.type === 'LIGA');
  const eventosGrandes = leagues.filter(l => l.type === 'EVENTO_GRANDE');
  const eventos2do = leagues.filter(l => l.type === 'EVENTO_2DO_ORDEN');

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIGA':
        return <Trophy className="w-4 h-4" />;
      case 'EVENTO_GRANDE':
        return <Star className="w-4 h-4" />;
      case 'EVENTO_2DO_ORDEN':
        return <Award className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="h-10 w-full max-w-xs animate-pulse bg-muted rounded-md" />;
  }

  return (
    <Select
      value={selectedLeague?.id || ''}
      onValueChange={(value) => {
        const league = leagues.find(l => l.id === value);
        setSelectedLeague(league || null);
      }}
    >
      <SelectTrigger className="w-full min-w-[200px] max-w-sm bg-card border-border">
        <SelectValue placeholder="Seleccionar liga o evento">
          {selectedLeague && (
            <div className="flex items-center gap-2">
              {selectedLeague.logo_url && (
                <img 
                  src={selectedLeague.logo_url} 
                  alt={selectedLeague.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-black">{selectedLeague.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-[9999]">
        {ligas.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ligas
            </SelectLabel>
            {ligas.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                <div className="flex items-center gap-2">
                  {league.logo_url && (
                    <img 
                      src={league.logo_url} 
                      alt={league.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span>{league.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {eventosGrandes.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Eventos Grandes
            </SelectLabel>
            {eventosGrandes.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                <div className="flex items-center gap-2">
                  {league.logo_url && (
                    <img 
                      src={league.logo_url} 
                      alt={league.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span>{league.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {eventos2do.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Eventos 2do Orden
            </SelectLabel>
            {eventos2do.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                <div className="flex items-center gap-2">
                  {league.logo_url && (
                    <img 
                      src={league.logo_url} 
                      alt={league.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span>{league.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default LeagueSelector;
