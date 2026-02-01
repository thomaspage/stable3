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


export const FilterButton = styled(IconButton)<{active?: boolean}>(({theme, active}) => ({
  backgroundColor: theme.palette.background.default,
  pointerEvents: "auto",
  minWidth: 0,
  height: 64,
  width: 64,
  borderRadius: 1000,
  textTransform: "uppercase",
  fontSize: "0.9rem",
  border: active ? `3px solid ${theme.palette.warning.main}` : undefined,
  "& .MuiSvgIcon-root": {
    fontSize: 32,
    color: active ? theme.palette.warning.main : undefined,
  },

  // Keep background solid on hover to avoid transparent look
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },

  [theme.breakpoints.down("sm")]: {
    display: "none",
  }
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  flexShrink: 0,
  borderRadius: 1000,
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.down("md")]: {
    display: "flex",
    // Fixed square tap target and centered icon so hover/ripple is centered
    width: 64,
    height: 64,
    padding: 0,
    marginLeft: 20,
    marginRight: 8,
    "& .MuiSvgIcon-root": {
      fontSize: 40,
    },
  },

  // iPad/medium resolution - larger size
  [theme.breakpoints.between("sm", "md")]: {
    width: 96,
    height: 96,
    padding: 0,
    marginLeft: 24,
    marginRight: 8,
    "& .MuiSvgIcon-root": {
      fontSize: 56,
    },
  },

  [theme.breakpoints.down("sm")]: {
    width: 72,
    height: 72,
    padding: 0,
    marginLeft: 16,
    marginRight: 8,
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