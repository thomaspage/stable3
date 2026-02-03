import { styled } from "@mui/material/styles";
// import { styled as styled2 } from "styled-components";
import { IconButton, Modal } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';

export const ImageCarouselContainer = styled("div")({
    overflow: "hidden",
    width: "100%",
    userSelect: "none",
    WebkitUserSelect: "none",
    position: "relative",
    ".swiper-button-prev, .swiper-button-next": {
      display: "none",
    },

    "&:hover": {
      ".swiper-button-prev, .swiper-button-next": {
        display: "unset",
      },
    },
  });

export const Slides = styled(Swiper)({
  display: "flex",

  "--swiper-navigation-color": "#333",
});

export const Slide = styled(SwiperSlide)<{ $clickable: boolean }>(({ $clickable }) => ({
  flex: "0 0 100%",
  minWidth: 0,
  width: "100%",
  position: "relative",
  overflow: "hidden",
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

export const Image = styled("img")<{$aspectRatio: number}>(({$aspectRatio}) => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  aspectRatio: $aspectRatio?.toString(),
  // zIndex: 1,
  // position: "relative",
  // border: "1px solid black",
  // backgroundColor: "red",
  //   borderRadius: 10,
}));

export const BlurredImage = styled("img")({
  position: "absolute",
  top: -50,
  left: -50,
  objectFit: "cover",
  zIndex: -1,
  filter: "blur(50px)",
  aspectRatio: "none",
  transformOrigin: "center",
  width: "calc(100% + 100px)",
  height: "calc(100% + 100px)",
});

export const PreviewImages = styled("div")({
  padding: "10px 0",
  display: "flex",
  gap: 5,
  whiteSpace: "nowrap",
  overflowX: "auto",
  justifyContent: "center",
});


export const PreviewImage = styled("img")({
  cursor : "pointer",
  height: 50,
  // width: "100%",
  // height: "100%",
  // objectFit: "cover",
  // aspectRatio: "3/2",
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
  zIndex: 1,
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


export const PopupWrapper = styled("div")({

  backgroundColor: "black",
})

export const StyledModal = styled(Modal)({
  // display: "none"
})