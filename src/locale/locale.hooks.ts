import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [, setLanguage] = useState(i18n.language);

  useEffect(() => {
    i18n.on("languageChanged", (lng) => {
      setLanguage(lng);
    });
  }, [i18n]);
};
