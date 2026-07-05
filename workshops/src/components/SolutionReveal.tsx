import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { CodeBlock } from './CodeBlock';
import styles from './SolutionReveal.module.css';

interface SolutionRevealProps {
  solution: string;
  explanation: string;
}

export function SolutionReveal({ solution, explanation }: SolutionRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const { isPolish } = useLanguage();

  return (
    <>
      {/* Compact reveal button */}
      <div className={styles.container}>
        <div className={styles.overlayContent}>
          <span className={styles.icon}>👀</span>
          <span className={styles.text}>
            {isPolish ? 'Rozwiązanie ukryte' : 'Solution hidden'}
          </span>
          <button
            className={styles.revealButton}
            onClick={() => setRevealed(true)}
          >
            {isPolish ? 'Pokaż rozwiązanie' : 'Reveal Solution'}
          </button>
        </div>
      </div>

      {/* Modal popup */}
      {revealed && (
        <div className={styles.modalOverlay} onClick={() => setRevealed(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setRevealed(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className={styles.modalContent}>
              <h4 className={styles.title}>💻 {isPolish ? 'Rozwiązanie' : 'Solution'}</h4>
              <CodeBlock code={solution} />

              <h4 className={styles.title}>📖 {isPolish ? 'Wyjaśnienie' : 'Explanation'}</h4>
              <div className={styles.explanation}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                    li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                    ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
                    strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
                    code: ({ children }) => <code className={styles.inlineCode}>{children}</code>,
                  }}
                >
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
