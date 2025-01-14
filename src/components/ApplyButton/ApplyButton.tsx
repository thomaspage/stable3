import * as amplitude from '@amplitude/analytics-browser';
import { useTranslation } from "react-i18next";
import {
  Hamburger,
  ApplyButtonContainer,
} from "./ApplyButton.styles";
import { Button, IconButton } from '@mui/material';

const ApplyButton = ({}) => {

  const { t } = useTranslation();

  return (
    <ApplyButtonContainer>

      <Button variant="outlined" target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSdiyd8JK8_U-QHjvppensyQkHpMouI8b2cP6O6N_tfTjwZngw/viewform?usp=sf_link" color="inherit">{t("APPLY") as string}</Button>

    </ApplyButtonContainer>
  );
};

export default ApplyButton;
