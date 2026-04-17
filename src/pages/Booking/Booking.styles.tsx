import { Container } from "@mui/material";
import { styled } from "styled-components";

export const BookingContainer = styled(Container)(({ theme }) => ({
  paddingTop: 16,
  paddingBottom: 48,
}));

export const FormRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginBottom: 16,
  width: "100%",
}));
