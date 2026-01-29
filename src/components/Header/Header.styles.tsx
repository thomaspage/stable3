import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button, IconButton } from "@mui/material";


export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "100%",
  overflow: "hidden",
});

export const HeaderOptions = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  gap: 10,
  flexWrap: "nowrap",
  
  [theme.breakpoints.down("md")]: {
    display: "none",
  }
}));

export const Logo = styled("img")(({theme}) => ({
  height: 100,
  margin: "10px",
  flexShrink: 0,
  
  [theme.breakpoints.down("md")]: {
    height: 60,
    margin: "5px",
  },
  
  [theme.breakpoints.down("sm")]: {
    height: 50,
    margin: "5px",
  }
}));


export const FilterButton = styled(IconButton)(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  pointerEvents: "auto",
  minWidth: 0,
  height: 50,
  width: 50,
  borderRadius: 1000,
  textTransform: "uppercase",
  fontSize: "0.9rem",

  [theme.breakpoints.down("sm")]: {
    display: "none",
  }
}));

export const MobileMenuButton = styled(IconButton)(({theme}) => ({
  display: "none",
  flexShrink: 0,
  
  [theme.breakpoints.down("md")]: {
    display: "flex",
    marginRight: 10,
  }
}));

export const MobileDrawerContent = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  padding: 20,
  minWidth: 250,
}))