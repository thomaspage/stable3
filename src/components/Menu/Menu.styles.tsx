import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { styled as styled2 } from "styled-components";
import { Button, Container, Typography } from "@mui/material";

export const MenuContainer = styled("div")<{ open: boolean }>(
  ({ theme, open }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 225,
    zIndex: 1,

    [theme.breakpoints.down("md")]: {
      position: "absolute",
      ...(open && {
        position: "fixed",
      }),
      top: 15,
      left: 15,
      pointerEvents: "none",
    },
  })
);

export const List = styled("div")<{ open: boolean }>(({ theme, open }) => ({
  flexGrow: 1,

  position: "fixed",
  top: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "white",
  alignItems: "flex-start",

  transition: "opacity 0.5s",

  [theme.breakpoints.down("md")]: {
    left: 0,
    right: 0,
    opacity: 0,
    pointerEvents: "none",
    padding: 50,

    ...(open && {
      pointerEvents: "auto",
      opacity: 1,
    }),
    ...(!open && {
      transition: "opacity 0s",
    }),
  },
}));

export const ListItem = styled(NavLink)(({}) => ({
  padding: "5px 5px 5px 2px",
  textDecoration: "none",
  position: "relative",
  margin: "2px 0",
}));

export const Hamburger = styled(Button)(
  ({ theme }) => `
  pointer-events: auto;
  z-index: 1;
  min-width: 0px;

  ${theme.breakpoints.up("md")} {
    display: none;
  }

  
`
);

export const Buns = styled("div")(
  ({ theme }) => `

  height: 1.75em;
  display: flex;
  flex-direction: column;
  justify-content: center;


`
);

export const Patty = styled("div")<{ open?: boolean, duration?: number }>(
  ({ theme, open, duration=0.25 }) => `

  height: 2px;
  flex-shrink: 0;
  margin: 2px 0;
  width: 20px;
  background-color: black;
  border-radius: 5px;

  transition: margin ${duration}s ${duration}s, rotate ${duration}s, opacity 0s ${duration}s;

  ${open && `

    transition: margin ${duration}s, rotate ${duration}s ${duration}s, opacity 0s ${duration}s;

    &:nth-child(1) {
      margin: -2px 0px;
      rotate: 45deg;

    }
    &:nth-child(2) {
      margin: 0px;
      opacity: 0;

    }
    &:nth-child(3) {
      margin: -2px 0px;
      rotate: -45deg;

    }

  `}

`
);

export const ListType = styled2(Typography).attrs({
  variant: "h2",
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: "inline-block",
  // borderBottomWidth: 1,
  // borderBottomStyle: "solid",
  // borderBottomColor: "transparent",

  color: "black",
  padding: "0px 12px 2px 2px",

  "&::after": {
    content: '""',
    display: "block",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 1,
    transition: "opacity 0.3s",
    backgroundColor: "black",
    width: 0,
    opacity: 0,

    ...(selected && {
      width: "100%",
      opacity: 1,
    }),
  },
}));

export const Hearts = styled2("img")<{
  $top?: number;
  $bottom?: number;
  $left?: number;
  $right?: number;
  $height?: number;
}>(({ theme, $height, $top, $bottom, $left, $right }) => ({
  position: "absolute",
  top: $top !== undefined ? $top : "unset",
  bottom: $bottom !== undefined ? $bottom : "unset",
  left: $left !== undefined ? $left : "unset",
  right: $right !== undefined ? $right : "unset",
  height: $height !== undefined ? $height : "unset",
}));
