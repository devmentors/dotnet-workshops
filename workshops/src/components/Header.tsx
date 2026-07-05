import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import styles from './Header.module.css';

export function Header() {
  const { isPolish } = useLanguage();

  const title = isPolish ? 'DevMentors - Warsztaty .NET' : 'DevMentors - .NET Workshops';
  const subtitle = isPolish
    ? 'Cztery dni: idiomatyczny C#, narzędzia, ekosystem (ASP.NET Core, EF Core) i architektura (.NET 10 / C# 14)'
    : 'Four days: idiomatic C#, tooling, ecosystem (ASP.NET Core, EF Core) and architecture (.NET 10 / C# 14)';

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <img
            src="https://devmentors.io/wp-content/uploads/2024/12/logo-dark.png"
            alt="DevMentors"
            className={styles.logo}
          />
          <div className={styles.languageToggleWrapper}>
            <LanguageToggle />
          </div>
        </div>
        <h1 className={styles.title}>
          <span className={styles.emoji}>🧩</span>
          <span className={styles.gradient}>{title}</span>
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </header>
  );
}
