import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  CalendarLink,
  GuestGroup,
  GuestsContainer,
  MoreDetails,
  RSVPContainer,
  RSVPResponse,
  StyledRadioGroup,
} from "./RSVP.styles";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";
import Arrow from "./arrow";
import { GOOGLE_SCRIPT_URL } from "../../App";

interface Guest {
  firstName: string;
  lastName: string;
  dietaryRestrictions: string;
}

const emptyGuest: Guest = {
  firstName: "",
  lastName: "",
  dietaryRestrictions: "",
};

const RSVP = ({}) => {
  const { t } = useTranslation();

  const rsvpMessage = localStorage.getItem("rsvpMessage");

  const [completed, setCompleted] = useState<boolean>(!!rsvpMessage);
  const [loading, setLoading] = useState<boolean>(false);
  const [bringingGuest, setBringingGuest] = useState<boolean>(true);
  const [primaryGuest, setPrimaryGuest] = useState<Guest>(emptyGuest);
  const [secondaryGuest, setSecondaryGuest] = useState<Guest>(emptyGuest);
  const [attending, setAttending] = useState<boolean>(true);
  const [showArrow, setShowArrow] = useState<boolean>(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    // Prevent page reload
    event.preventDefault();

    // Disable form
    setLoading(true);

    const data = {
      primaryGuest,
      secondaryGuest,
      attending,
      bringingGuest: bringingGuest && attending,
    };

    amplitude.track("RSVP", data);

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
        alert("There was an error submitting your RSVP. Please try again.");
        amplitude.track("Error", {
          data,
          error: "There was an error submitting your RSVP. Please try again."
        })
      });
  };

  const handleFormCompletion = () => {
    const rsvpMessage = attending
      ? "rsvpMessageAttending"
      : "rsvpMessageNotAttending";
    localStorage.setItem("rsvpMessage", rsvpMessage);
    setCompleted(true);
    setShowArrow(true);
  };

  if (completed) {
    return (
      <RSVPContainer style={{ gap: 20 }}>
        {showArrow && (
          <>
            <Arrow />
            <MoreDetails variant="h2">
              {t("pages.rsvp.moreDetails")}
            </MoreDetails>
          </>
        )}
        <RSVPResponse variant="h3">
          {t(`pages.rsvp.${rsvpMessage}`)}
        </RSVPResponse>

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
              href="https://www.google.com/calendar/render?action=TEMPLATE&text=Max%20%26%20Tom%20Wedding&dates=20240901T170000/20240902T000000&location=Jatoba%2C%201184%20R.%20du%20Square-Phillips%2C%20Montr%C3%A9al%2C%20QC%20H3B%203C8%2C%20Canada&ctz=America/Toronto&sf=true&output=xml"
            >
              + {t("pages.rsvp.addToGoogle")}
            </CalendarLink>
            <CalendarLink
              onClick={() =>
                amplitude.track("Click", {
                  button: "Add to Calendar",
                  calendar: "iCal",
                })
              }
              href={`${process.env.PUBLIC_URL}/invite.ics`}
            >
              + {t("pages.rsvp.addToICal")}
            </CalendarLink>
          </div>
        )}
      </RSVPContainer>
    );
  }

  return (
    <RSVPContainer>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%" }} disabled={loading}>
          <GuestsContainer>
            <GuestGroup>
              <Typography fontWeight={500}>
                {bringingGuest ? t("pages.rsvp.guest1") : t("pages.rsvp.guest")}
              </Typography>
              <TextField
                type="text"
                variant="standard"
                color="primary"
                label={t("pages.rsvp.firstName")}
                onChange={(e) =>
                  setPrimaryGuest({
                    ...primaryGuest,
                    firstName: e.target.value,
                  })
                }
                value={primaryGuest.firstName}
                fullWidth
                required
              />

              <TextField
                type="text"
                variant="standard"
                color="primary"
                label={t("pages.rsvp.lastName")}
                onChange={(e) =>
                  setPrimaryGuest({ ...primaryGuest, lastName: e.target.value })
                }
                value={primaryGuest.lastName}
                fullWidth
                required
              />

              <TextField
                type="text"
                variant="standard"
                color="primary"
                label={t("pages.rsvp.dietaryRestrictions")}
                onChange={(e) =>
                  setPrimaryGuest({
                    ...primaryGuest,
                    dietaryRestrictions: e.target.value,
                  })
                }
                value={primaryGuest.dietaryRestrictions}
                fullWidth
              />
            </GuestGroup>

            {bringingGuest && (
              <GuestGroup>
                <Typography fontWeight={500}>
                  {t("pages.rsvp.guest2")}
                </Typography>

                <TextField
                  type="text"
                  variant="standard"
                  color="primary"
                  label={t("pages.rsvp.firstName")}
                  onChange={(e) =>
                    setSecondaryGuest({
                      ...secondaryGuest,
                      firstName: e.target.value,
                    })
                  }
                  value={secondaryGuest.firstName}
                  fullWidth
                  required
                />

                <TextField
                  type="text"
                  variant="standard"
                  color="primary"
                  label={t("pages.rsvp.lastName")}
                  onChange={(e) =>
                    setSecondaryGuest({
                      ...secondaryGuest,
                      lastName: e.target.value,
                    })
                  }
                  value={secondaryGuest.lastName}
                  fullWidth
                  required
                />

                <TextField
                  type="text"
                  variant="standard"
                  color="primary"
                  label={t("pages.rsvp.dietaryRestrictions")}
                  onChange={(e) =>
                    setSecondaryGuest({
                      ...secondaryGuest,
                      dietaryRestrictions: e.target.value,
                    })
                  }
                  value={secondaryGuest.dietaryRestrictions}
                  fullWidth
                />
              </GuestGroup>
            )}
          </GuestsContainer>

          <FormGroup
            sx={{
              marginBottom: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={!bringingGuest}
                  onChange={() => {
                    setBringingGuest(!bringingGuest);
                    setSecondaryGuest(emptyGuest);
                  }}
                />
              }
              label={t("pages.rsvp.justMe")}
            />
          </FormGroup>

          <StyledRadioGroup
            value={attending}
            onChange={(e) => setAttending(e.target.value === "true")}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={
                bringingGuest
                  ? t("pages.rsvp.wellBeThere")
                  : t("pages.rsvp.illBeThere")
              }
              sx={{ flexBasis: 20, flexGrow: 1 }}
            />
            <div style={{ flexBasis: 20, flexGrow: 2 }}>
              <FormControlLabel
                value={false}
                control={<Radio />}
                label={t("pages.rsvp.notAttending")}
              />
              {!attending && <span>😭</span>}
            </div>
          </StyledRadioGroup>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 20,
            }}
          >
            {loading && <CircularProgress size={20} />}

            <Button
              disabled={loading}
              sx={{ width: 150 }}
              variant="outlined"
              color="primary"
              type="submit"
            >
              {t("pages.rsvp.submit")}
            </Button>
          </div>
        </FormControl>
      </form>

      <Typography
        sx={{ maxWidth: 450, textAlign: "right", marginLeft: "auto" }}
        fontSize="0.8em"
      >
        {t("pages.rsvp.infants")}
      </Typography>
    </RSVPContainer>
  );
};

export default RSVP;
