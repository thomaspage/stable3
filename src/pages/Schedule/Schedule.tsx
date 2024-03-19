import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineClasses,
  timelineContentClasses,
  timelineItemClasses,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Typography } from "@mui/material";
import { ScheduleContainer } from "./Schedule.styles";
import { useTranslation } from "react-i18next";

const Schedule = ({}) => {

  const { t } = useTranslation();

  return (
    <ScheduleContainer>
      {/* <Typography>Below you will find a rough timeline of the day. We have organized complimentary valet parking for all guests of the wedding.</Typography> */}
      <Timeline
      // sx={{
      //   width: "fit-content",
      //   [`& .${timelineOppositeContentClasses.root}`]: {
      //     flex: 0.4,
      //   },
      //   [`& .${timelineContentClasses.root}`]: {
      //     flex: 0.6,
      //   },
      // }}
      >
        {/* <TimelineItem>
          <TimelineOppositeContent>5:00pm</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Guest arrival & welcome drink</Typography>
            <Typography color="#333" fontSize="0.8em">We have organized complimentary valet parking for all wedding guests</Typography>
          </TimelineContent>
        </TimelineItem> */}
        <TimelineItem>
          <TimelineOppositeContent>{t("pages.schedule.5pm")}</TimelineOppositeContent>
          <TimelineSeparator sx={{ height: 100 }}>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t("pages.schedule.ceremony")}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
        <TimelineOppositeContent>{t("pages.schedule.6pm")}</TimelineOppositeContent>
          <TimelineSeparator sx={{ height: 100 }}>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t("pages.schedule.cocktail")}</TimelineContent>
        </TimelineItem>

        <TimelineItem>
        <TimelineOppositeContent>{t("pages.schedule.7pm")}</TimelineOppositeContent>
          <TimelineSeparator sx={{ height: 300 }}>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t("pages.schedule.dinner")}</TimelineContent>
        </TimelineItem>

        {/* Dancing */}
        <TimelineItem>
        <TimelineOppositeContent>{t("pages.schedule.10pm")}</TimelineOppositeContent>
          <TimelineSeparator sx={{ height: 400 }}>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
            <div
              style={{
                height: 200,
                width: 2,
                background: "linear-gradient(0, transparent, #bdbdbd)",
              }}
            ></div>
          </TimelineSeparator>
          <TimelineContent>{t("pages.schedule.dancing")}</TimelineContent>
        </TimelineItem>
      </Timeline>
    </ScheduleContainer>
  );
};

export default Schedule;
