import { Typography } from "@mui/material";
import {
  ScheduleContainer,
  HomeContainer,
  Place,
  Time,
  Title,
} from "./Home.styles";
import { useTranslation } from "react-i18next";

const Home = ({}) => {

  const { t } = useTranslation();
  
  return (
    <HomeContainer>
      <Title variant="h1">
        Max & Tom
        <br />
        {t("pages.home.title.2")}
        <br />
        {t("pages.home.title.3")}
        <br />
        {t("pages.home.title.4")}
      </Title>

      <ScheduleContainer>
        <Time>
          <Typography variant="h3">{t("pages.home.day")}</Typography>
          <Typography variant="h3">{t("pages.home.date")}</Typography>
          <Typography variant="h3">{t("pages.home.time")}</Typography>
        </Time>
        <Place>
          <Typography variant="h3">{t("pages.home.place")}</Typography>
          <Typography variant="h3">{t("pages.home.address")}</Typography>
          <Typography variant="h3">{t("pages.home.city")}</Typography>
        </Place>
      </ScheduleContainer>

      <Typography fontFamily="Ballantines" variant="h4">{t("pages.home.dancing")}</Typography>
    </HomeContainer>
  );
};

export default Home;
