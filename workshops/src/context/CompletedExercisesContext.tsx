import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface LastCompleted {
  dayId: string;
  exerciseId: string;
}

interface CompletedExercisesContextType {
  // Per-day completion API
  isCompleted: (dayId: string, exerciseId: string) => boolean;
  markCompleted: (dayId: string, exerciseId: string) => void;
  completedCountForDay: (dayId: string) => number;
  clearAll: () => void;
  lastCompleted: LastCompleted | null;
  clearLastCompleted: () => void;
}

const STORAGE_KEY = 'dotnet-workshops-completed-by-day';

type CompletedByDay = Record<string, string[]>;

const CompletedExercisesContext = createContext<CompletedExercisesContextType | null>(null);

function loadFromStorage(): CompletedByDay {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed as CompletedByDay;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return {};
}

export function CompletedExercisesProvider({ children }: { children: ReactNode }) {
  const [completedByDay, setCompletedByDay] = useState<CompletedByDay>(() => loadFromStorage());
  const [lastCompleted, setLastCompleted] = useState<LastCompleted | null>(null);

  // Persist to localStorage whenever completedByDay changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedByDay));
    } catch {
      // Ignore localStorage errors
    }
  }, [completedByDay]);

  const isCompleted = useCallback(
    (dayId: string, exerciseId: string) => {
      return (completedByDay[dayId] ?? []).includes(exerciseId);
    },
    [completedByDay]
  );

  const markCompleted = useCallback(
    (dayId: string, exerciseId: string) => {
      setCompletedByDay((prev) => {
        const dayList = prev[dayId] ?? [];
        if (dayList.includes(exerciseId)) {
          return prev; // Already completed, don't change state
        }
        return { ...prev, [dayId]: [...dayList, exerciseId] };
      });
      setLastCompleted((prev) => {
        const already = (completedByDay[dayId] ?? []).includes(exerciseId);
        if (!already) {
          return { dayId, exerciseId };
        }
        return prev;
      });
    },
    [completedByDay]
  );

  const completedCountForDay = useCallback(
    (dayId: string) => {
      return (completedByDay[dayId] ?? []).length;
    },
    [completedByDay]
  );

  const clearAll = useCallback(() => {
    setCompletedByDay({});
    setLastCompleted(null);
  }, []);

  const clearLastCompleted = useCallback(() => {
    setLastCompleted(null);
  }, []);

  return (
    <CompletedExercisesContext.Provider
      value={{
        isCompleted,
        markCompleted,
        completedCountForDay,
        clearAll,
        lastCompleted,
        clearLastCompleted,
      }}
    >
      {children}
    </CompletedExercisesContext.Provider>
  );
}

export function useCompletedExercises() {
  const context = useContext(CompletedExercisesContext);
  if (!context) {
    throw new Error('useCompletedExercises must be used within a CompletedExercisesProvider');
  }
  return context;
}
