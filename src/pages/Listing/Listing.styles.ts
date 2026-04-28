import { Container, ImageList, Modal, Typography } from "@mui/material";
import { styled } from "styled-components";
import ImageCarousel from "../../components/ImageCarousel";

export const ListingContainer = styled(Container)({});

export const StyledImageCarousel = styled(ImageCarousel)(({ theme }) => ({
  maxWidth: 600,
}));

export const MobileImageCarousel = styled("div")(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: { display: "none" },
}));

export const ImageCarouselModal = styled(Modal)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

export const StyledImageList = styled(ImageList)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

export const BodyContainer = styled("div")({
  padding: 10,
  display: "flex",
  gap: 50,
  flexWrap: "wrap",
  marginBottom: 36,
});

export const DescriptionContainer = styled("div")({});

export const AmenitiesContainer = styled("div")({
  flexBasis: "40%",
  flexGrow: 1,
  minWidth: 400,
});

// Responsive list for amenities: two columns on desktop, one column on small screens
export const AmenitiesList = styled("div")(({ theme }) => ({
  columnCount: 2,
  columnGap: 24,
  [theme.breakpoints.down("sm")]: {
    columnCount: 1,
  },
}));

export const TitleWithMap = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "stretch",
  gap: 8,
  marginTop: 8,
  marginBottom: 20,

  // On narrower screens, stack the map below the spotlight so the title
  // always has enough room to render in full.
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

export const TitleContainer = styled("div")({
  flex: "1 1 0",
  minWidth: 0,
  // Center title horizontally within the container
  textAlign: "center",
});

// Title text — allowed to wrap so long addresses stay fully readable in narrow layouts
export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.35rem",
  marginBottom: 0,
  minWidth: 0,
  textAlign: "center",
  paddingTop: 0,
  lineHeight: 1.2,
  wordBreak: "break-word",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.30rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.15rem",
    paddingTop: 6,
  },
}));

export const MapContainer = styled("div")({
  flex: "2 1 0",
  minWidth: 0,
  minHeight: 200,
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  isolation: "isolate",
  // clip-path rounds all 4 corners even for Mapbox's transformed canvas
  // (overflow: hidden alone doesn't clip transformed descendants on webkit).
  clipPath: "inset(0 round 12px)",
});

export const ContactContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 20,
});

export const DescriptionWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 50,
  flexBasis: "55%",
  flexGrow: 1,
  flexShrink: 0,
});
