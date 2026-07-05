import type { Exercise } from '../types/Exercise';
import { useCompletedExercises } from '../context/CompletedExercisesContext';
import { useLanguage } from '../context/LanguageContext';
import { useDay } from '../context/DayContext';
import styles from './ExerciseList.module.css';

interface ExerciseListProps {
  selectedId?: string;
  onSelect: (exercise: Exercise) => void;
  onSurveyClick?: () => void;
}

const categoryEmojis: Record<string, string> = {
  'Application Design': '🎨',
  'Module Architecture': '🧱',
  'Synchronous Communication': '🔗',
  'Asynchronous Communication': '📨',
  'Transactional Patterns': '🔄',
  'AI in .NET': '🤖',
};

export function ExerciseList({ selectedId, onSelect, onSurveyClick }: ExerciseListProps) {
  const { isCompleted } = useCompletedExercises();
  const { isPolish } = useLanguage();
  const { activeDay, activeDayId } = useDay();

  const exercises = activeDay.exercises;

  // Group exercises by category, using translated category for display
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const categoryKey = exercise.category; // Use English as key for grouping
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const getCategoryDisplay = (exercises: Exercise[]) => {
    const first = exercises[0];
    return isPolish && first.categoryPl ? first.categoryPl : first.category;
  };

  const getTitle = (exercise: Exercise) => {
    return isPolish && exercise.titlePl ? exercise.titlePl : exercise.title;
  };

  if (activeDay.locked) {
    return (
      <nav className={styles.list}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🔒</span>
          <h3 className={styles.placeholderTitle}>
            {isPolish ? 'Pojawią się w dniu szkolenia' : 'Available on the training day'}
          </h3>
          <p className={styles.placeholderText}>
            {isPolish
              ? 'Zadania tego dnia odblokujemy na żywo podczas szkolenia. Na razie zaczynamy od Dnia 1.'
              : 'This day’s exercises unlock live during the training. For now, start with Day 1.'}
          </p>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.list}>
      {exercises.length === 0 ? (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🚧</span>
          <h3 className={styles.placeholderTitle}>
            {isPolish ? 'Zadania w przygotowaniu' : 'Exercises in preparation'}
          </h3>
        </div>
      ) : (
        Object.entries(groupedExercises).map(([category, categoryExercises]) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>{categoryEmojis[category] || '📁'}</span>
              {getCategoryDisplay(categoryExercises)}
            </h3>
            <ul className={styles.exercises}>
              {categoryExercises.map((exercise) => {
                const completed = isCompleted(activeDayId, exercise.id);
                return (
                  <li key={exercise.id}>
                    <button
                      className={`${styles.exerciseButton} ${
                        selectedId === exercise.id ? styles.selected : ''
                      } ${completed ? styles.completed : ''}`}
                      onClick={() => onSelect(exercise)}
                    >
                      <span className={`${styles.sequenceNumber} ${completed ? styles.completedNumber : ''}`}>
                        #{exercise.sequenceNumber}
                      </span>
                      <span className={`${styles.separator} ${completed ? styles.completedSeparator : ''}`}></span>
                      <div className={styles.exerciseContent}>
                        <span className={styles.exerciseTitle}>{getTitle(exercise)}</span>
                        <span className={styles.time}>
                          {exercise.timeMinutes} min
                        </span>
                      </div>
                      {completed && (
                        <span className={styles.completedIcon}>✅</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}

      {activeDay.isLast && onSurveyClick && (
        <div className={styles.surveySection}>
          <button className={styles.surveyButton} onClick={onSurveyClick}>
            <span className={styles.surveyIcon}>📝</span>
            <span className={styles.surveyText}>
              {isPolish ? 'Zostaw opinię' : 'Leave Feedback'}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
