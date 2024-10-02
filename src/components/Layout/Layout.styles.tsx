import { Container, Paper, Typography } from "@mui/material";
import styled from "styled-components";

export const LayoutContainer = styled(Paper).attrs({ elevation: 0, square: true })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    height: "100vh",
    overflow: "auto",

    // backgroundColor: theme.palette.background.default,
  })
);

export const Title = styled(Typography).attrs({ variant: "h1" })(
  ({ theme }) => ({
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  })
);
