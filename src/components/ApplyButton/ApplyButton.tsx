import { useTranslation } from "react-i18next";
import { ApplyButtonContainer } from "./ApplyButton.styles";
import { Button } from "@mui/material";


/**
 * Apply button component that links to the Google Form application
 */
const ApplyButton = () => {
  const { t } = useTranslation();

  return (
    <ApplyButtonContainer>

      <Button variant="outlined" size="large" target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSdiyd8JK8_U-QHjvppensyQkHpMouI8b2cP6O6N_tfTjwZngw/viewform?usp=sf_link" color="inherit"
        sx={{
          minHeight: 48,
          padding: "10px 24px",
          fontSize: "1rem",
        }}
      >
        {t("APPLY") as string}
        </Button>
    </ApplyButtonContainer>
  );
};

export default ApplyButton;
