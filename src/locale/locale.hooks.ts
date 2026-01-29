import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to handle language switching
 * Listens for language change events and triggers re-renders
 */
export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup event listener on unmount
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);
};
