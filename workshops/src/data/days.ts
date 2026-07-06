import type { Exercise } from '../types/Exercise';
import { exercises as dzien1Exercises } from './exercises';
import { dzien2Exercises } from './exercises-dzien2';
import { modulAiExercises } from './exercises-modul-ai';

export interface Day {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  folder: string; // repo folder, e.g. 'dzien1-csharp' (used by the test runner)
  locked: boolean; // true = zadania pojawią się dopiero w dniu szkolenia
  isLast: boolean; // true only for day 4
  exercises: Exercise[];
}

export const days: Day[] = [
  {
    id: 'dzien1',
    number: 1,
    title: 'Idiomatyczny C#',
    titleEn: 'Idiomatic C#',
    folder: 'dzien1-csharp',
    locked: false,
    isLast: false,
    exercises: dzien1Exercises,
  },
  {
    id: 'dzien2',
    number: 2,
    title: 'Ekosystem .NET (ASP.NET Core, EF Core)',
    titleEn: '.NET ecosystem (ASP.NET Core, EF Core)',
    folder: 'dzien2-ekosystem',
    locked: false,
    isLast: false,
    exercises: [...dzien2Exercises, ...modulAiExercises], // + dopinka AI (osobna solucja ai-cwiczenia)
  },
  {
    id: 'dzien3',
    number: 3,
    title: 'Narzędzia i developer experience',
    titleEn: 'Tooling and developer experience',
    folder: 'dzien3-narzedzia',
    locked: true,
    isLast: false,
    exercises: [],
  },
  {
    id: 'dzien4',
    number: 4,
    title: 'Architektura w projekcie .NET',
    titleEn: '.NET project architecture',
    folder: 'dzien4-architektura',
    locked: true,
    isLast: true,
    exercises: [],
  },
];
