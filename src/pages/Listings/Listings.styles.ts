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

export const Tiles = styled("div")({
  padding: 30,
})

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
      background: theme.palette.background.default,
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
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

export const SidebarButton = styled(IconButton)(({theme}) => ({

  position: "absolute",
  right: 15,
  bottom: 15,
  backgroundColor: theme.palette.background.default,

  boxShadow: theme.shadows[5],

  [theme.breakpoints.up("sm")]: {
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