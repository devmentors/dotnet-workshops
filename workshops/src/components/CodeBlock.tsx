import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'csharp' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
