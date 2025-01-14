import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button, IconButton } from "@mui/material";


export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const HeaderOptions = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  gap: 10,
});

export const Logo = styled("img")(({theme}) => ({
  height: 100,
  margin: "10px",
  // width: "100%",
  // height: "100%",
  // objectFit: "contain",
  // aspectRatio: "3/2",
  // border: "1px solid black",
  // backgroundColor: "red",
  //   borderRadius: 10,
  [theme.breakpoints.down("sm")]: {
    height: 75,
  }
}));


export const FilterButton = styled(IconButton)(({theme}) => ({

  backgroundColor: theme.palette.background.default,
  pointerEvents: "auto",
  minWidth: 0,
  height: 50,
  width: 50,
  borderRadius: 1000,
  // lineHeight: "1rem",
  textTransform: "uppercase",
  fontSize: "0.9rem",

  [theme.breakpoints.down("sm")]: {
    display: "none",
  }
}))