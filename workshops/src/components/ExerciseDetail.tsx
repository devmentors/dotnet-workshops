import { useState } from 'react';
import type { Exercise } from '../types/Exercise';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLanguage } from '../context/LanguageContext';
import { useCompletedExercises } from '../context/CompletedExercisesContext';
import { useDay } from '../context/DayContext';
import { SolutionReveal } from './SolutionReveal';
import { TestRunner } from './TestRunner';
import styles from './ExerciseDetail.module.css';

interface ExerciseDetailProps {
  exercise: Exercise;
}

const categoryEmojis: Record<string, string> = {
  'Application Design': '🎨',
  'Module Architecture': '🧱',
  'Synchronous Communication': '🔗',
  'Asynchronous Communication': '📨',
  'Transactional Patterns': '🔄',
  'AI in .NET': '🤖',
};

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  const { isPolish } = useLanguage();
  const { isCompleted, markCompleted } = useCompletedExercises();
  const { activeDayId } = useDay();
  const [hintVisible, setHintVisible] = useState(false);

  const markdownComponents: Components = {
    h1: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h2: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    h3: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
    p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    li: ({ children }) => <li className={styles.listItem}>{children}</li>,
    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
    ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
    blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return isInline ? (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: '1rem 0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
  };

  const description = isPolish ? exercise.descriptionPl : exercise.description;
  const hint = isPolish ? exercise.hintPl : exercise.hint;
  const explanation = isPolish ? exercise.solutionExplanationPl : exercise.solutionExplanation;
  const externalLinkLabel = isPolish ? exercise.externalLinkLabelPl : exercise.externalLinkLabel;
  const title = isPolish && exercise.titlePl ? exercise.titlePl : exercise.title;
  const category = isPolish && exercise.categoryPl ? exercise.categoryPl : exercise.category;
  const completed = isCompleted(activeDayId, exercise.id);

  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>
            {categoryEmojis[exercise.category] || '📁'} {category}
          </span>
          <span className={styles.time}>
            <span className={styles.clockIcon}>⏱️</span>
            {exercise.timeMinutes} min
          </span>
        </div>
        <h2 className={styles.title}>{title}</h2>
      </header>

      <section className={styles.description}>
        <div className={styles.descriptionContent}>
          <ReactMarkdown components={markdownComponents}>{description}</ReactMarkdown>
        </div>
      </section>

      {exercise.externalLink && (
        <section className={styles.externalLinkSection}>
          <a
            href={exercise.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLinkButton}
          >
            <span className={styles.externalLinkIcon}>🔗</span>
            {externalLinkLabel || 'Open External Resource'}
          </a>
        </section>
      )}

      {hint && (
        <section className={styles.hintSection}>
          <button
            className={styles.hintButton}
            onClick={() => setHintVisible((v) => !v)}
          >
            <span className={styles.hintIcon}>💡</span>
            {hintVisible
              ? isPolish ? 'Ukryj wskazówkę' : 'Hide hint'
              : isPolish ? 'Pokaż wskazówkę' : 'Show hint'}
          </button>
          {hintVisible && (
            <div className={styles.hintPanel}>
              <ReactMarkdown components={markdownComponents}>{hint}</ReactMarkdown>
            </div>
          )}
        </section>
      )}

      {exercise.relatedFiles && exercise.relatedFiles.length > 0 && (
        <section className={styles.relatedFiles}>
          <h4 className={styles.sectionTitle}>
            📂 {isPolish ? 'Powiązane pliki' : 'Related Files'}
          </h4>
          <ul className={styles.fileList}>
            {exercise.relatedFiles.map((file) => (
              <li key={file} className={styles.file}>
                <code>{file}</code>
              </li>
            ))}
          </ul>
        </section>
      )}

      {exercise.testFilter && <TestRunner exercise={exercise} />}

      {!exercise.testFilter && (
        <section className={styles.manualCompleteSection}>
          {completed ? (
            <div className={styles.completedBadge}>
              <span className={styles.completedBadgeIcon}>✅</span>
              {isPolish ? 'Ukończone!' : 'Completed!'}
            </div>
          ) : (
            <button
              className={styles.markCompleteButton}
              onClick={() => markCompleted(activeDayId, exercise.id)}
            >
              <span className={styles.markCompleteIcon}>✓</span>
              {isPolish ? 'Oznacz jako ukończone' : 'Mark as Complete'}
            </button>
          )}
        </section>
      )}

      {exercise.solution && explanation && (
        <SolutionReveal
          solution={exercise.solution}
          explanation={explanation}
        />
      )}
    </article>
  );
}
