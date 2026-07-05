import { useState, useEffect, useRef } from 'react';
import type { Exercise, DotnetTestResult, TestRunResult } from '../types/Exercise';
import { useCompletedExercises } from '../context/CompletedExercisesContext';
import { useDay } from '../context/DayContext';
import styles from './TestRunner.module.css';

const TEST_SERVER_URL = 'http://localhost:3001';

interface TestRunnerProps {
  exercise: Exercise;
}

export function TestRunner({ exercise }: TestRunnerProps) {
  const [results, setResults] = useState<DotnetTestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const { markCompleted } = useCompletedExercises();
  const { activeDay, activeDayId } = useDay();

  // Track which exercise the current results belong to
  const resultsForExerciseRef = useRef<string | null>(null);

  // Reset state when exercise changes
  useEffect(() => {
    setResults([]);
    setHasRun(false);
    setOutput('');
    setError(null);
    setShowOutput(false);
    resultsForExerciseRef.current = null;
  }, [exercise.id]);

  // Check if all tests passed and mark as completed
  const allPassed = hasRun && results.length > 0 && results.every((r) => r.passed);

  useEffect(() => {
    // Only mark completed if results belong to the current exercise
    if (allPassed && resultsForExerciseRef.current === exercise.id) {
      markCompleted(activeDayId, exercise.id);
    }
  }, [allPassed, exercise.id, activeDayId, markCompleted]);

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    setOutput('');
    setError(null);

    // Track which exercise these results are for
    const currentExerciseId = exercise.id;

    try {
      const response = await fetch(`${TEST_SERVER_URL}/run-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testFilter: exercise.testFilter,
          day: activeDay.folder,
          testCwd: exercise.testCwd,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result: TestRunResult = await response.json();

      // Only update state if we're still on the same exercise
      if (exercise.id === currentExerciseId) {
        resultsForExerciseRef.current = currentExerciseId;
        setResults(result.testResults);
        setOutput(result.output);

        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      if (exercise.id === currentExerciseId) {
        setError(
          err instanceof Error
            ? `Failed to connect to test server. Make sure the server is running on port 3001.\n\nError: ${err.message}`
            : 'Unknown error occurred'
        );
      }
    }

    if (exercise.id === currentExerciseId) {
      setRunning(false);
      setHasRun(true);
    }
  };

  const someFailed = hasRun && results.some((r) => !r.passed);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          <span className={styles.dotnetIcon}>🧪</span>
          dotnet test
        </h4>
        <div className={styles.headerActions}>
          {hasRun && (
            <button
              className={styles.outputToggle}
              onClick={() => setShowOutput(!showOutput)}
            >
              {showOutput ? 'Hide Output' : 'Show Output'}
            </button>
          )}
          <button
            className={`${styles.runButton} ${running ? styles.running : ''}`}
            onClick={runTests}
            disabled={running}
          >
            {running ? 'Running...' : 'Run Tests'}
          </button>
        </div>
      </div>

      {exercise.testFilter && (
        <div className={styles.filterInfo}>
          <code>--filter "{exercise.testFilter}"</code>
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <pre>{error}</pre>
        </div>
      )}

      {showOutput && output && (
        <div className={styles.outputBox}>
          <pre>{output}</pre>
        </div>
      )}

      {running && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <span>Running tests...</span>
        </div>
      )}

      {!running && results.length > 0 && (
        <div className={styles.testList}>
          {results.map((result, index) => (
            <div
              key={index}
              className={`${styles.testCase} ${
                result.passed ? styles.passed : styles.failed
              }`}
            >
              <div className={styles.testIcon}>
                {result.passed ? '✓' : '✗'}
              </div>
              <div className={styles.testInfo}>
                <span className={styles.testName}>{result.name}</span>
                <span className={styles.testDescription}>{result.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasRun && !running && (
        <div
          className={`${styles.summary} ${
            allPassed ? styles.successSummary : someFailed ? styles.failedSummary : ''
          }`}
        >
          {error ? (
            <>❌ Test execution failed</>
          ) : allPassed ? (
            <>🎉 All tests passed!</>
          ) : results.length === 0 ? (
            <>⚠️ No tests found matching the filter</>
          ) : (
            <>
              {results.filter((r) => r.passed).length} / {results.length} tests
              passed
            </>
          )}
        </div>
      )}
    </div>
  );
}
