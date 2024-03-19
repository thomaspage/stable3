import { Typography } from "@mui/material";
import { styled } from "styled-components";

export const AccomodationsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 30,
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

export const Hotel = styled("div")({
})

export const Hotels = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 20,

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  

}))


export const InlineFlex = styled("div")({
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    
})

export const HotelName = styled(Typography).attrs({ variant: "h3" })(({ theme }) => ({
    textDecoration: "none",
    color: "black",
}));