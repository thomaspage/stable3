import { Container, ImageList, Modal, Typography } from "@mui/material";
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
  maxWidth: 600,

}));

export const MobileImageCarousel = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { display: "none" },
}));

export const ImageCarouselModal = styled(Modal)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: { display: "none" },
}));


export const StyledImageList = styled(ImageList)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: { display: "none" },
  // display: "none"

}));


export const BodyContainer = styled('div')({
  padding: 10,
  display: "flex",
  gap: 50,
  flexWrap: "wrap",
});


export const DescriptionContainer = styled('div')({

});

export const AmenitiesContainer = styled('div')({
  flexBasis: "40%",
  flexGrow: 1,
  minWidth: 400,
});

export const AmenityText = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  // justifyContent: "space-between",
  gap: 20,
  alignItems: "center",
}));

export const HighlightsContainer = styled('div')({
  padding: 10,
});

export const HightlightText = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  // justifyContent: "space-between",
  gap: 20,
  alignItems: "center",
  marginBottom: 5,
}));

export const TitleWithMap = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 20,
}));

export const TitleContainer = styled('div')(({ theme }) => ({
  flexBasis: "33%",
  flexGrow: 1,
  minWidth: 300,
}));

export const MapContainer = styled('div')(({ theme }) => ({
  flexBasis: "67%",
  flexGrow: 1,
  flexShrink: 1,
  minHeight: 200,
}));

export const ContactContainer = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 20,
}));



export const DescriptionWrapper = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 50,

  flexBasis: "55%",
  flexGrow: 1,
  flexShrink: 0,  
}));