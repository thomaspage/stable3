import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button, IconButton } from "@mui/material";

export const ThemeSelectorContainer = styled("div")(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // alignItems: "flex-start",
  // width: 225,
  // zIndex: 1,

  // [theme.breakpoints.down("md")]: {
    // position: "absolute",
    // top: 15,
    // right: 15,
    // pointerEvents: "none",
  // },
}));

export const Hamburger = styled(IconButton)(({ theme }) => ({
  pointerEvents: "auto",
  minWidth: 0,
  height: 64,
  width: 64,
  borderRadius: 1000,
  // lineHeight: "1rem",
  textTransform: "uppercase",
  fontSize: "0.7rem",
  "& .MuiSvgIcon-root": {
    fontSize: 32,
  },
  // zIndex: 1,

  // [theme.breakpoints.up("md")]: {
  //   display: "none",
  // },
}));
