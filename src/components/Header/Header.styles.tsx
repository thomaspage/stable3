import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button, IconButton } from "@mui/material";


export const HeaderContainer = styled("div")<{ alignWithContainer?: boolean }>(
  ({ theme, alignWithContainer }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "100%",
    overflow: "hidden",
    // When used on a listing/unit page we want the header content to align with the page content edges
    padding: alignWithContainer ? "12px 0" : "18px 30px",

    [theme.breakpoints.down("md")]: {
      padding: alignWithContainer ? "8px 0" : "10px 20px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: alignWithContainer ? "6px 0" : "8px 16px",
    },
  })
);

export const HeaderOptions = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0 8px 20px",
  gap: 12,
  flexWrap: "nowrap",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const Logo = styled("img")(({ theme }) => ({
  height: 140,
  margin: 0,
  flexShrink: 0,

  // Make the logo noticeably smaller on medium and small screens
  [theme.breakpoints.down("md")]: {
    height: 96,
  },

  [theme.breakpoints.down("sm")]: {
    height: 64,
  },
}));


export const FilterButton = styled(IconButton)(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  pointerEvents: "auto",
  minWidth: 0,
  height: 64,
  width: 64,
  borderRadius: 1000,
  textTransform: "uppercase",
  fontSize: "0.9rem",
  "& .MuiSvgIcon-root": {
    fontSize: 32,
  },

  [theme.breakpoints.down("sm")]: {
    display: "none",
  }
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  flexShrink: 0,

  [theme.breakpoints.down("md")]: {
    display: "flex",
    padding: 16,
    "& .MuiSvgIcon-root": {
      fontSize: 40,
    },
  },

  // iPad/medium resolution - larger size
  [theme.breakpoints.between("sm", "md")]: {
    padding: 24,
    "& .MuiSvgIcon-root": {
      fontSize: 56,
    },
  },

  [theme.breakpoints.down("sm")]: {
    padding: 20,
    "& .MuiSvgIcon-root": {
      fontSize: 48,
    },
  },
}));

export const MobileDrawerContent = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  padding: 20,
  minWidth: 250,
}))