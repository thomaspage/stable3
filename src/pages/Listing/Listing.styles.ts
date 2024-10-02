import { Container, ImageList, Typography } from "@mui/material";
import { styled } from "styled-components";
import ImageCarousel from "../../components/ImageCarousel";

export const ListingContainer = styled(Container)({
  // display: "flex",
  // flexDirection: "column",
  // gap: 30,
  // height: "100%",
  // overflow: "auto",
});

export const MetroImg = styled("img").attrs({
  src: `${process.env.PUBLIC_URL}/img/metro.png`,
})({
  height: 30,
});

export const WalkerImg = styled("img").attrs({
  src: `${process.env.PUBLIC_URL}/img/walking.png`,
})({
  height: 15,
});

export const Hotel = styled("div")({});

export const Hotels = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 20,

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

export const InlineFlex = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
});

export const HotelName = styled(Typography).attrs({ variant: "h3" })(
  ({ theme }) => ({
    textDecoration: "none",
    color: "black",
  })
);

export const StyledImageCarousel = styled(ImageCarousel)(({ theme }) => ({
  // [theme.breakpoints.up("sm")]: { display: "none" },
  maxWidth: 600
}));

export const StyledImageList = styled(ImageList)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: { display: "none" },
  display: "none"

}));
