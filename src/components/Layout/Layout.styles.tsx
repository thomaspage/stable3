import { Typography } from "@mui/material";
import styled from "styled-components";

export const LayoutContainer = styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
})

export const Title = styled(Typography).attrs({ variant: "h1" })(({ theme }) => ({

    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  }));