import { Paper, Typography } from "@mui/material";
import styled from "styled-components";

export const TileContainer = styled('div')<{ $active: boolean}>(
  ({ $active, theme }) => ({
    height: "100%",
    // borderRadius: 10,
    color: theme.palette.text.primary,
    position: "relative",
    // overflow: "hidden",

    ...($active && {
      backgroundColor: theme.palette.grey[200],

      "&::after": {
        content: '""',
        display: "block",
        height: "2px",
        background: "black",
        borderRadius: 1000,
        position: "absolute",
        left: 15,
        right: 15,
        bottom: 7,
      },
    }),

    "&:hover": {
    //   backgroundColor: theme.palette.grey[200],
    },
  })
);

export const TileInner = styled('div')<{ $rented: boolean }>(
  ({ $rented, theme }) => ({

    ...($rented && {
      pointerEvents: "none",
      opacity: 0.4,
    }),


  })
);


export const Title = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 700,
});

export const TileContent = styled("div")({
  padding: "10px 10px 15px 10px",
})

export const AvailabilityBadge = styled(Typography).attrs({variant: "caption"})(({theme}) => ({
  position: "absolute",
  zIndex: 1,
  top: 10,
  left: 10,
  padding: "3px 10px",
  borderRadius: 3,
  fontSize: "0.9rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  pointerEvents: "none",
}))
export const RentedBadge = styled(Typography).attrs({variant: "caption"})(({theme}) => ({
  position: "absolute",
  zIndex: 1,
  top: 10,
  left: 10,
  padding: "3px 10px",
  borderRadius: 3,
  fontSize: "0.9rem",
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  pointerEvents: "none",
}))