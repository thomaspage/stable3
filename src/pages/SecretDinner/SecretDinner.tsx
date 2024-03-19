import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Dialog,
  IconButton,
  Radio,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import {
  CalendarLink,
  GuestGroup,
  GuestsContainer,
  MoreDetails,
  SecretDinnerContainer,
  SecretDinnerResponse,
  StyledRadioGroup,
} from "./SecretDinner.styles";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";
import { Link } from "react-router-dom";
import { GOOGLE_SCRIPT_URL, theme } from "../../App";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Add } from "@mui/icons-material";

const LOCAL_STORAGE_KEY = "secretDinnerRSVPMessage";

const SecretDinner = ({}) => {
  const { t } = useTranslation();

  const rsvpMessage = localStorage.getItem(LOCAL_STORAGE_KEY);

  // const [completed, setCompleted] = useState<boolean>(!!rsvpMessage);
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [attending, setAttending] = useState<boolean>(true);

  const theme2 = createTheme({
    ...theme,
    typography: {
      ...theme.typography,
      h1: {
        ...theme.typography.h1,
        letterSpacing: "0.15em",
      },
      h3: {
        ...theme.typography.h3,
        fontSize: "1rem",
        // fontWeight: 300,
        // lineHeight: "1.5em",
        letterSpacing: "0.2em",
      },
      fontFamily: ["Cooper", "PPHatton"].join(","),
    },
  });

  const fullScreen = useMediaQuery(theme2.breakpoints.down("md"));

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    // Prevent page reload
    event.preventDefault();

    // Disable form
    setLoading(true);

    const data = {
      action: "welcome-evening-rsvp",
      attending,
      firstName,
      lastName,
      numberOfGuests: attending ? numberOfGuests : null,
    };

    amplitude.track("SecretDinner", data);

    fetch(GOOGLE_SCRIPT_URL, {
      redirect: "follow",
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setLoading(false);
        handleFormCompletion();
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        alert(
          "There was an error submitting your SecretDinner. Please try again."
        );
        amplitude.track("Error", {
          data,
          error:
            "There was an error submitting your SecretDinner. Please try again.",
        });
      });
  };

  const handleFormCompletion = () => {
    const rsvpMessage = attending
      ? "rsvpMessageAttending"
      : "rsvpMessageNotAttending";
    localStorage.setItem(LOCAL_STORAGE_KEY, rsvpMessage);
    setCompleted(true);
  };

  if (completed) {
    return (
      <SecretDinnerContainer style={{ gap: 20 }}>
        <SecretDinnerResponse variant="h3">
          {t(`pages.secretDinner.${rsvpMessage}`)}
        </SecretDinnerResponse>

        {rsvpMessage === "rsvpMessageAttending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <CalendarLink
              onClick={() =>
                amplitude.track("Click", {
                  button: "Add to Calendar",
                  calendar: "Google",
                })
              }
              target="_blank"
              href="https://www.google.com/calendar/render?action=TEMPLATE&text=Welcome%20Dinner%20-%20Max%20%26%20Tom%27s%20Wedding&dates=20240830T190000/20240831T000000&location=243%20rue%20du%20Square-Sir-George-Etienne-Cartier%2C%20Montr%C3%A9al%2C%20QC%20H4C%203A3%2C%20Canada&ctz=America/Toronto&sf=true&output=xml"
            >
              + {t("pages.secretDinner.addToGoogle")}
            </CalendarLink>
            <CalendarLink
              onClick={() =>
                amplitude.track("Click", {
                  button: "Add to Calendar",
                  calendar: "iCal",
                })
              }
              href={`${process.env.PUBLIC_URL}/welcome-evening-invite.ics`}
            >
              + {t("pages.secretDinner.addToICal")}
            </CalendarLink>
          </div>
        )}
      </SecretDinnerContainer>
    );
  }

  return (
    <ThemeProvider theme={theme2}>
      <SecretDinnerContainer>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={`${process.env.PUBLIC_URL}/img/dinner-thumb.jpeg`}
        >
          <source
            src={`${process.env.PUBLIC_URL}/video/dinner-hero`}
            type="video/mp4"
          />
        </video>
        <div style={{ maxWidth: 450, margin: "auto" }}>
          <Typography variant="h1" textAlign="center" marginBottom={2}>
            {t("pages.secretDinner.title1")}<br />
            {t("pages.secretDinner.title2")}
          </Typography>
          <Typography textAlign="center">
            {t("pages.secretDinner.description")}
          </Typography>
        </div>
        <div>
          <Typography variant="h3" textAlign="center">
            {t("pages.secretDinner.date")}
          </Typography>
          <Typography variant="h3" textAlign="center">
            {t("pages.secretDinner.time")}
          </Typography>
        </div>
        <a style={{maxWidth: 400, margin: "auto", textDecoration: "underline", color: "black"}} href="https://maps.app.goo.gl/KqYotRCoVq26spaM8" target="_blank" >
          <Typography variant="h3" textAlign="center">
            {t("pages.secretDinner.location")}
          </Typography>
          <Typography variant="h3" textAlign="center">
            243 RUE DU SQUARE-SIR-GEORGE-ÉTIENNE-CARTIER
            <br />
            MONTRÉAL, QC H4C 3A3
          </Typography>
        </a>
        <div style={{ margin: "auto" }}>
          {rsvpMessage ? (
            <Typography textAlign="center" sx={{maxWidth: 250}}>{t(`pages.secretDinner.${rsvpMessage}`)}</Typography>
          ) : (
            <Button
              onClick={() => setModalOpen(true)}
              sx={{ paddingLeft: 5, paddingRight: 5 }}
              variant="outlined"
            >
              <Typography variant="h3">RSVP</Typography>
            </Button>
          )}
        </div>
      </SecretDinnerContainer>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullScreen={fullScreen}
        sx={{ top: fullScreen ? "unset" : 0 }}
        // container={"test"}
        // anchor="bottom"
      >
        <div style={{ padding: 50, minWidth: fullScreen ? "unset" : 500 }}>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ width: "100%" }} disabled={loading}>
              <GuestsContainer>

                <Typography variant="h2">{t("pages.secretDinner.canYouMakeIt")}</Typography>
                <StyledRadioGroup
                  value={attending}
                  onChange={(e) => setAttending(e.target.value === "true")}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t("pages.secretDinner.yes")}
                  />
                  <div>
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t("pages.secretDinner.no")}
                    />
                    {/* {!attending && <span>🤫</span>} */}
                  </div>
                </StyledRadioGroup>
                {/* <GuestGroup> */}
                {/* <Typography fontWeight={500}>
                  {t("pages.secretDinner.guest")}
                </Typography> */}

                <TextField
                  type="text"
                  variant="standard"
                  color="primary"
                  label={t("pages.secretDinner.firstName")}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  fullWidth
                  required
                />

                <TextField
                  type="text"
                  variant="standard"
                  color="primary"
                  label={t("pages.secretDinner.lastName")}
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  fullWidth
                  required
                />
                {/* </GuestGroup> */}
              </GuestsContainer>
              {/* 
            <ToggleButtonGroup exclusive value={attending ? ["yes"] : ["no"]} onChange={(e, value) => setAttending(value === "yes")}>
              <ToggleButton value="yes">Yes</ToggleButton>
              <ToggleButton value="no">No</ToggleButton>
            </ToggleButtonGroup> */}

              {/* <FormGroup
              sx={{
                marginBottom: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!bringingGuest}
                    onChange={() => {
                      setNumberOfGuests(!bringingGuest);
                      setSecondaryGuest(emptyGuest);
                    }}
                  />
                }
                label={t("pages.secretDinner.justMe")}
              />
            </FormGroup> */}

              {attending && (
                <div>
                  <div
                    style={{
                      marginBottom: 50,
                      gap: 25,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontWeight={500}>
                      {t("pages.secretDinner.attending")}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        // justifyContent: "center",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <IconButton
                        disabled={numberOfGuests <= 1}
                        onClick={() => setNumberOfGuests(numberOfGuests - 1)}
                        color="primary"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography fontSize={20}>{numberOfGuests}</Typography>
                      <IconButton
                        disabled={numberOfGuests >= 5}
                        onClick={() => setNumberOfGuests(numberOfGuests + 1)}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                  {/* <div>Private message to host</div>
                  <div>Meal preference</div> */}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {loading && <CircularProgress size={20} />}

                {!loading && (
                  <Button
                    hidden={loading}
                    color="primary"
                    onClick={() => setModalOpen(false)}
                  >
                    {t("pages.secretDinner.cancel")}
                  </Button>
                )}

                <Button
                  disabled={loading}
                  sx={{ width: 150 }}
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  {t("pages.secretDinner.submit")}
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

export default SecretDinner;
