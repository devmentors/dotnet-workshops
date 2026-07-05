import styles from './EmptyState.module.css';

export function EmptyState() {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>📚</span>
      <h3 className={styles.title}>Select an Exercise</h3>
      <p className={styles.description}>
        Choose an exercise from the sidebar to get started with your workshop.
      </p>
    </div>
  );
}
