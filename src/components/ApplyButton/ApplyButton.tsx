import { useTranslation } from "react-i18next";
import { ApplyButtonContainer } from "./ApplyButton.styles";
import { Button } from "@mui/material";
import { EXTERNAL_URLS } from "../../constants";

/**
 * Apply button component that links to the Google Form application
 */
const ApplyButton = () => {
  const { t } = useTranslation();

  return (
    <ApplyButtonContainer>
      <Button 
        variant="outlined" 
        target="_blank" 
        href={EXTERNAL_URLS.GOOGLE_FORM} 
        color="inherit"
      >
        {t("common.apply")}
      </Button>
    </ApplyButtonContainer>
  );
};

export default ApplyButton;
