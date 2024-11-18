import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import styled from "styled-components";

export const FiltersContainer = styled.div(({  }) => ({
  // backgroundColor: active ? "red" : "none",
}));

export const SquareToggleButtonGroup = styled(ToggleButtonGroup)({
  gap: 10,
})

export const SquareToggleButton = styled(ToggleButton)({
  aspectRatio: "1/1",
  height: "3em",
  fontWeight: 500,
  // width: "1em",
  borderColor: "transparent !important",
  borderWidth: "1px !important",
  borderStyle: "solid !important",
  borderRadius: "10px !important",
  margin: "0 !important",
})

export const Capitalized = styled(Typography)({

  paddingTop: 20,

  "&:first-letter": {
    textTransform: "capitalize"
  }
})


export const ButtonsContainer = styled('div')({

  display: "flex",
  gap: 5,
})