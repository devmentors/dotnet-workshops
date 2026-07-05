import { useLanguage } from '../context/LanguageContext';
import styles from './LanguageToggle.module.css';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className={styles.toggle} onClick={toggleLanguage} title="Toggle language">
      <span className={`${styles.flag} ${language === 'en' ? styles.active : ''}`}>
        🇺🇸 EN
      </span>
      <span className={styles.separator}>|</span>
      <span className={`${styles.flag} ${language === 'pl' ? styles.active : ''}`}>
        🇵🇱 PL
      </span>
    </button>
  );
}
