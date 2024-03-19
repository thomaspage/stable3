import { Button, RadioGroup, Typography } from "@mui/material";
import { styled } from "styled-components";

export const SecretDinnerContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 50,
  marginTop: "-10vh",
});

export const GuestsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // flexWrap: "wrap",
  gap: 25,
  marginBottom: 40,
  width: "100%",

  [theme.breakpoints.up("md")]: {
    minWidth: 500,
  },
}));

export const GuestGroup = styled("div")({
  flexGrow: 1,
  gap: 13,
  display: "inline-flex",
  // flexDirection: "column",
});

export const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  flexDirection: "row",
  // justifyContent: "center",
  gap: 30,
  // marginBottom: 50,

  [theme.breakpoints.down("md")]: {
    // flexDirection: "column",
  },
}));

export const SecretDinnerResponse = styled(Typography)(({ theme }) => ({

  [theme.breakpoints.up("md")]: {
    textAlign: "center",
    margin: "auto",    
  },
}));

export const CalendarLink = styled(Button)<{target?: string}>(({ theme }) => ({

  textTransform: "none",
  alignSelf: "baseline",
  letterSpacing: 0.5,
  fontWeight: 200,

  [theme.breakpoints.up("md")]: {
    alignSelf: "auto"
  },

  // [theme.breakpoints.up("md")]: {
  //   textAlign: "center",
  //   margin: "auto",    
  // },
}));



export const MoreDetails = styled(Typography)`
  position: fixed;
  top: 80px;
  left: 115px;
  display: none;
  opacity: 0;

  animation-duration: 2s;
  animation-delay: 1.25s;
  animation-fill-mode: forwards;
  animation-name: appear;  

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: block;
  }

  @keyframes appear {
    to {
      opacity: 1;
    }
  }  
`
