import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { Button, IconButton } from "@mui/material";

export const ImageCarouselContainer = styled("div")(
  ({  }) => ({
    overflow: "hidden",
    width: "100%",
    userSelect: "none",
    WebkitUserSelect: "none",
    position: "relative",

    "&:hover": {
      [`${NavigationButton}`]: {
        display: "unset",
      },
    },
  })
);

export const Slides = styled("div")(({}) => ({
  display: "flex",
  //   marginLeft: -20,
  touchAction: "pan-y",
}));

export const Slide = styled("div")<{ $clickable: boolean }>(({ $clickable }) => ({
  flex: "0 0 100%",
  minWidth: 0,
  width: "100%",
  position: "relative",
  //   paddingLeft: 20,

  ...($clickable && {
    "&:hover::after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      pointerEvents: "none",
    },
  }),
}));

export const Image = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  aspectRatio: "3/2",
  // border: "1px solid black",
  // backgroundColor: "red",
  //   borderRadius: 10,
});

export const NavigationButtons = styled("div")({
  display: "flex",
  position: "absolute",
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  justifyContent: "space-between",
  alignItems: "center",
  pointerEvents: "none",
  //   boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1) inset",
});

export const NavigationButton = styled(IconButton)({
  display: "none",
  pointerEvents: "auto",
  height: "100%",
  borderRadius: 0,
  color: "black",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
