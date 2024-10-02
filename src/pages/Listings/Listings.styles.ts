import { IconButton, Typography, styled } from "@mui/material";
import Hamburger from "../../components/Hamburger";

export const ListingsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 30,
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

  }

  
}))

export const View = styled("div")({
  flexBasis: 1000,
  flexGrow: 1,
  overflowY: "auto",
  direction: "rtl",
})

export const ViewInner = styled("div")({
  direction: "ltr",
  height: "100%",
  width: "100%",
})

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

  [theme.breakpoints.up("sm")]: {
    display: "none",
  }
}))