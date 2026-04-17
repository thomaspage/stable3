import { IconButton, styled } from "@mui/material";
import Hamburger from "../../components/Hamburger";

export const ListingsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const MapContainer = styled("div")({
  flexBasis: 1000,
  flexGrow: 1,
  width: "100%",
  height: "100%",
});

export const FiltersContainer = styled("div")({});

export const ViewContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  height: 0,
});

export const Tiles = styled("div")(({ theme }) => ({
  // Reduce bottom padding so content doesn't leave excess space on small/medium screens
  padding: "12px 30px 20px 30px",

  [theme.breakpoints.down("md")]: {
    padding: "8px 20px 12px 20px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "6px 16px 8px 16px",
  },
}));

export const Sidebar = styled("div")<{ open: boolean }>(({ theme, open }) => ({
  flexBasis: 400,
  height: "100%",
  overflowY: "auto",
  maxWidth: "100%",
  padding: 20,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.down("sm")]: {
    ...(open
      ? {
          // Cover the full viewport and sit above all content so underlying listings don't show through
          background: theme.palette.background.paper,
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: theme.zIndex.modal,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: 20,
        }
      : {
          display: "none",
        }),
  },

  [theme.breakpoints.up("sm")]: {
    ...(open
      ? {
          background: theme.palette.background.default,
          zIndex: 1,
        }
      : {
          display: "none",
        }),
  },
}));

export const View = styled("div")<{ $sidebarOpen: boolean }>(({ $sidebarOpen }) => ({
  flexBasis: 1000,
  flexGrow: 1,
  overflowY: "auto",
  direction: $sidebarOpen ? "rtl" : "ltr",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
}));

export const ViewInner = styled("div")({
  direction: "ltr",
  height: "100%",
  width: "100%",
});

export const SidebarButton = styled(IconButton)<{ active?: boolean }>(({ theme, active }) => ({
  // Keep button visible and accessible above content; use fixed positioning on mobile so
  // it sits above system UI (safe area) and scrolling content.
  position: "fixed",
  right: "16px",
  bottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
  backgroundColor: theme.palette.background.default,

  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.tooltip + 10,
  border: active ? `3px solid ${theme.palette.warning.main}` : undefined,
  "& .MuiSvgIcon-root": {
    color: active ? theme.palette.warning.main : undefined,
  },
  // Keep background solid on hover so the button doesn't become transparent over listings
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
  // Hide on large desktops only — show on mobile and tablet
  [theme.breakpoints.up("lg")]: {
    display: "none",
  },
}));

export const SidebarHamburger = styled(Hamburger)(({ theme }) => ({
  alignSelf: "flex-end",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));
