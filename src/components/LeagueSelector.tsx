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

type League = {
  id: string;
  name: string;
  type: 'LIGA' | 'EVENTO_GRANDE' | 'EVENTO_2DO_ORDEN';
  description: string | null;
  is_active: boolean;
  display_order: number;
};

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
      <SelectTrigger className="w-full max-w-xs bg-card border-border">
        <SelectValue placeholder="Seleccionar liga o evento" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-50">
        {ligas.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ligas
            </SelectLabel>
            {ligas.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
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
                {league.name}
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
                {league.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default LeagueSelector;
