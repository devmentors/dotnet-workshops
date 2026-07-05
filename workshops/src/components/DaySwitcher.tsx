import { useDay } from '../context/DayContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './DaySwitcher.module.css';

export function DaySwitcher() {
  const { days, activeDayId, setActiveDayId } = useDay();
  const { isPolish } = useLanguage();

  return (
    <nav className={styles.switcher} aria-label={isPolish ? 'Wybór dnia' : 'Day selection'}>
      {days.map((day) => {
        const active = day.id === activeDayId;
        const title = isPolish ? day.title : day.titleEn;
        return (
          <button
            key={day.id}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => setActiveDayId(day.id)}
            aria-current={active ? 'true' : undefined}
          >
            <span className={styles.dayLabel}>
              {isPolish ? `Dzień ${day.number}` : `Day ${day.number}`}
            </span>
            <span className={styles.dayTitle}>{title}</span>
          </button>
        );
      })}
    </nav>
  );
}
