import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button } from "@mui/material";

export const LanguageSelectorContainer = styled("div")(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // alignItems: "flex-start",
  // width: 225,
  // zIndex: 1,

  // [theme.breakpoints.down("md")]: {
    position: "absolute",
    top: 15,
    right: 15,
    pointerEvents: "none",
  // },
}));

export const Hamburger = styled(Button)(({ theme }) => ({
  pointerEvents: "auto",
  minWidth: 0,
  // zIndex: 1,

  // [theme.breakpoints.up("md")]: {
  //   display: "none",
  // },
}));
