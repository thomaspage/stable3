import * as amplitude from '@amplitude/analytics-browser';
import { useTranslation } from "react-i18next";
import {
  Hamburger,
  LanguageSelectorContainer,
} from "./LanguageSelector.styles";

const LanguageSelector = ({}) => {

  const { i18n } = useTranslation();

  const isEnglish = i18n.resolvedLanguage === "en";
  const language = isEnglish ? "fr" : "en"

  const toggleLanguage = () => {
    amplitude.track("Change Language", { language })
    i18n.changeLanguage(language);
  }

  return (
    <LanguageSelectorContainer>
      <Hamburger color="inherit" onClick={toggleLanguage}>{language}</Hamburger>

    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;
