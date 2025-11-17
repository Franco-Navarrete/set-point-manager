import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type League = Tables<'leagues'>;

type LeagueContextType = {
  selectedLeague: League | null;
  setSelectedLeague: (league: League | null) => void;
};

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLeague, setSelectedLeagueState] = useState<League | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedLeague');
    if (saved) {
      try {
        setSelectedLeagueState(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading selected league:', e);
      }
    }
  }, []);

  const setSelectedLeague = (league: League | null) => {
    setSelectedLeagueState(league);
    if (league) {
      localStorage.setItem('selectedLeague', JSON.stringify(league));
    } else {
      localStorage.removeItem('selectedLeague');
    }
  };

  return (
    <LeagueContext.Provider value={{ selectedLeague, setSelectedLeague }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};
