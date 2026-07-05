import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { days, type Day } from '../data/days';

interface DayContextType {
  days: Day[];
  activeDay: Day;
  activeDayId: string;
  setActiveDayId: (dayId: string) => void;
}

const DayContext = createContext<DayContextType | null>(null);

export function DayProvider({ children }: { children: ReactNode }) {
  const [activeDayId, setActiveDayId] = useState<string>(days[0].id);

  const activeDay = useMemo(
    () => days.find((d) => d.id === activeDayId) ?? days[0],
    [activeDayId]
  );

  return (
    <DayContext.Provider value={{ days, activeDay, activeDayId, setActiveDayId }}>
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error('useDay must be used within a DayProvider');
  }
  return context;
}
