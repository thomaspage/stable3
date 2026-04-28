import { Box, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import ImageCarousel from "../../../components/ImageCarousel";
import {
  AvailabilityBadge,
  Description,
  RentedBadge,
  TileContainer,
  TileContent,
  TileInner,
  Title,
} from "./Tile.style";
import { TileProps } from "./Tile.types";
import { formatCurrency, formatDateWithOrdinal } from "../../../utils";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { NoPhotography, PlayArrow } from "@mui/icons-material";

/**
 * Tile component for displaying a rental listing in grid view
 * Shows images, key details, and availability status
 */
const Tile = ({
  id,
  title,
  description,
  availableDate,
  price,
  bathrooms,
  bedrooms,
  images,
  squareFootage,
  active,
  rented,
  videoTourLink,
}: TileProps) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const navigate = useNavigate();

  /**
   * Format the availability date
   * Converts UTC date and shows "Available now" if date has passed
   */
  const today = new Date();
  const date = new Date(availableDate);
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const formattedDate =
    date < today
      ? t("common.availableNow")
      : formatDateWithOrdinal({ date: utcDate, language });

  const theme = useTheme();
  const showPreviewsForScreen = useMediaQuery(theme.breakpoints.down('md'));

  // ── Virtual Visit badge — easy-tweak knobs ──
  // Vertical position from the bottom of the image wrapper (in px). Higher = badge sits higher.
  // Mobile/tablet (md and below) = above the carousel preview thumbnails.
  const virtualVisitBottomMobile = 90; // ← adjust me to nudge the badge up/down on small screens
  const virtualVisitBottomDesktop = 10;

  return (
    <TileContainer $active={active}>
      {rented ? (
        <RentedBadge>{t("common.rented")}</RentedBadge>
      ) : (
        <AvailabilityBadge>{formattedDate}</AvailabilityBadge>
      )}
      <TileInner $rented={rented}>
        <Box
          sx={{
            position: "relative",
            // Parent-level hover triggers the .hover-dim overlay below so the
            // dimming reaction fires whether the user hovers the image OR the
            // Virtual Visit badge — the badge no longer feels like a distinct item.
            "&:hover .hover-dim": { opacity: 1 },
            // Disable Swiper's per-slide :hover::after dimming inside the tile —
            // the wrapper's .hover-dim handles dimming for both image and badge,
            // and stacking both made the picture-hover noticeably darker than badge-hover.
            "& .swiper-slide:hover::after": { backgroundColor: "transparent" },
          }}
        >
          <Link to={`/listings/${id}`}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              {images.length ? (
                <ImageCarousel
                  images={images}
                  onClick={(index) => navigate(`/listings/${id}`)}
                  // Show previews only on mobile/tablet (md and below)
                  showPreviews={showPreviewsForScreen}
                />
              ) : (
                <NoPhotography />
              )}
            </Paper>
          </Link>

          {/* Hover-dim overlay — fades in whenever the parent Box is hovered
              (image area or Virtual Visit badge). pointerEvents: none so it
              doesn't intercept clicks. Opacity matches the prior "stacked" feel
              of the picture-hover so badge-hover and picture-hover look identical. */}
          <Box
            className="hover-dim"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "12px",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.15s ease",
              zIndex: 4,
            }}
          />

          {/* Video-tour badge — pill style matching the map popup's badge.
              Only shown when the listing has a YouTube link. */}
          {!rented && videoTourLink && (
            <Box
              onClick={() => navigate(`/listings/${id}`)}
              sx={{
                position: "absolute",
                // On screens that show the carousel preview thumbnails (md
                // and below), the badge sits just above them.
                bottom: { xs: virtualVisitBottomMobile, md: virtualVisitBottomDesktop },
                right: 10,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: "rgba(0, 0, 0, 0.65)",
                color: "#fff",
                pl: 0.75,
                pr: 1.25,
                py: 0.5,
                borderRadius: 999,
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: 0.3,
                border: "1.5px solid",
                borderColor: "primary.main",
              }}
            >
              <PlayArrow sx={{ fontSize: 18, color: "primary.main" }} />
              Virtual Visit
            </Box>
          )}
        </Box>

        <TileContent>
          {title && (
            <Link to={`/listings/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Title color="text" sx={{ "&:hover": { textDecoration: "underline" } }}>{title}</Title>
            </Link>
          )}
          {description && <Description color="text">{description}</Description>}
          {!!(bedrooms || bathrooms) && (
            <Typography>
              {!!bedrooms && (
                <span>
                  {bedrooms} {t("common.bed")}
                </span>
              )}
              {!!(bedrooms && bathrooms) && " / "}
              {bathrooms && (
                <span>
                  {bathrooms} {t("common.bath")}
                </span>
              )}

              {!!(bedrooms || bathrooms) && " • "}
              {squareFootage && (
                <span>
                  {squareFootage} {t("common.sqft")}
                </span>
              )}
            </Typography>
          )}

          {!rented && price && (
            <Typography>
              {formatCurrency({ amount: price, language })} /{" "}
              {t("common.month")}
            </Typography>
          )}
        </TileContent>
      </TileInner>
    </TileContainer>
  );
};

export default Tile;
