import { useState, useEffect } from 'react';
import type { Exercise } from './types/Exercise';
import { LanguageProvider } from './context/LanguageContext';
import { CompletedExercisesProvider, useCompletedExercises } from './context/CompletedExercisesContext';
import { DayProvider, useDay } from './context/DayContext';
import { Header } from './components/Header';
import { DaySwitcher } from './components/DaySwitcher';
import { Layout } from './components/Layout';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseDetail } from './components/ExerciseDetail';
import { EmptyState } from './components/EmptyState';
import { SuccessPopup } from './components/SuccessPopup';
import { SatisfactionSurvey } from './components/SatisfactionSurvey';
import './styles/global.css';

function AppContent() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const { lastCompleted, clearLastCompleted } = useCompletedExercises();
  const { activeDay } = useDay();

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  // When the active day changes, clear the selected exercise if it no longer
  // belongs to the active day.
  useEffect(() => {
    if (
      selectedExercise &&
      !activeDay.exercises.some((e) => e.id === selectedExercise.id)
    ) {
      setSelectedExercise(null);
    }
  }, [activeDay, selectedExercise]);

  // Show success popup when an exercise is completed
  useEffect(() => {
    if (lastCompleted) {
      setShowSuccessPopup(true);
    }
  }, [lastCompleted]);

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    clearLastCompleted();
  };

  return (
    <>
      <Header />
      <DaySwitcher />
      <Layout
        sidebar={
          <ExerciseList
            selectedId={selectedExercise?.id}
            onSelect={handleSelectExercise}
            onSurveyClick={() => setShowSurvey(true)}
          />
        }
      >
        {selectedExercise ? (
          <ExerciseDetail exercise={selectedExercise} />
        ) : (
          <EmptyState />
        )}
      </Layout>

      <SuccessPopup show={showSuccessPopup} onClose={handleCloseSuccessPopup} />
      <SatisfactionSurvey show={showSurvey} onClose={() => setShowSurvey(false)} />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <DayProvider>
        <CompletedExercisesProvider>
          <AppContent />
        </CompletedExercisesProvider>
      </DayProvider>
    </LanguageProvider>
  );
}

export default App;
