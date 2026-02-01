import { IconButton, Typography, styled } from "@mui/material";
import Hamburger from "../../components/Hamburger";

export const ListingsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  // gap: 30,
  height: "100%"
  // maxWidth: 300,
  // width: "100%",
});


export const MapContainer = styled("div")({
  // height: "100%",
  // width: "100%",
  flexBasis: 1000,
  flexGrow: 1,
  width: "100%",
  height: "100%",
})

export const FiltersContainer = styled("div")({

})

export const ViewContainer = styled("div")({
  // height: "100%",
  display: "flex",
  flexGrow: 1,
  height: 0,
})

export const ListView = styled("div")({
  // height: "100%",
  display: "flex",
  flexGrow: 1,
  height: 0,
  maxWidth: 800,
  margin: "auto",
})

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

export const Sidebar = styled("div")<{open: boolean}>(({theme, open}) => ({
  flexBasis: 400,
  // flexGrow: 1,
  height: "100%",
  overflowY: "auto",
  maxWidth: "100%",
  padding: 20,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.down("sm")]: {

    ...(open ? {
      // Cover the full viewport and sit above all content so underlying listings don't show through
      background: theme.palette.background.paper,
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: theme.zIndex.modal,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: 20,
    } : {
      display: "none",
    })

  },

  [theme.breakpoints.up("sm")]: {

    ...(open ? {
      background: theme.palette.background.default,
      zIndex: 1,
    } : {
      display: "none",
    })

  }

  
}))

export const View = styled("div")<{$sidebarOpen: boolean}>(({$sidebarOpen}) => ({
  flexBasis: 1000,
  flexGrow: 1,
  overflowY: "auto",
  direction: $sidebarOpen ? "rtl": "ltr",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
}))

export const ViewInner = styled("div")({
  direction: "ltr",
  height: "100%",
  width: "100%",
})

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

export const SidebarButton = styled(IconButton)<{active?: boolean}>(({theme, active}) => ({

  // Keep button visible and accessible above content; use fixed positioning on mobile so
  // it sits above system UI (safe area) and scrolling content.
  position: "fixed",
  right: '16px',
  bottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
  backgroundColor: theme.palette.background.default,

  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.tooltip + 10,
  border: active ? `3px solid ${theme.palette.warning.main}` : undefined,
  '& .MuiSvgIcon-root': {
    color: active ? theme.palette.warning.main : undefined,
  },
  // Keep background solid on hover so the button doesn't become transparent over listings
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  // Hide on large desktops only — show on mobile and tablet
  [theme.breakpoints.up("lg")]: {
    display: "none",
  }
}))

export const SidebarHamburger = styled(Hamburger)(({theme}) => ({

  alignSelf: "flex-end",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  }
}))


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