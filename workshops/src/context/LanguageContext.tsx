import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'pl';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isPolish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pl');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'pl' : 'en'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        isPolish: language === 'pl',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
