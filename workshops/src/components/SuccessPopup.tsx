import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './SuccessPopup.module.css';

interface SuccessPopupProps {
  show: boolean;
  onClose: () => void;
}

export function SuccessPopup({ show, onClose }: SuccessPopupProps) {
  const { isPolish } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.popup}>
        <div className={styles.icon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <h3 className={styles.title}>
          {isPolish ? 'Brawo!' : 'Congratulations!'}
        </h3>
        <p className={styles.message}>
          {isPolish
            ? 'Ukończyłeś to ćwiczenie!'
            : "You've completed this exercise!"}
        </p>
        <div className={styles.confetti}>
          <span className={styles.confettiPiece}>🎉</span>
          <span className={styles.confettiPiece}>🎊</span>
          <span className={styles.confettiPiece}>⭐</span>
        </div>
      </div>
    </div>
  );
}
