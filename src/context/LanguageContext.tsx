import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  t: TranslationKeys;
  setLanguage: (lang: Language) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('madina_lang');
    return (saved === 'ku' || saved === 'en' || saved === 'ar') ? saved : 'ku';
  });

  // Whenever the site is opened, the user requested that the language selection pops up
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const direction: 'rtl' | 'ltr' = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('madina_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsModalOpen(false);
  };

  const openLanguageModal = () => setIsModalOpen(true);
  const closeLanguageModal = () => setIsModalOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        t: translations[language],
        setLanguage,
        isModalOpen,
        setIsModalOpen,
        openLanguageModal,
        closeLanguageModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
