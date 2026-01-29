import { Paper, Typography } from "@mui/material";
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
import { formatCurrency, formatDate } from "../../../utils";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { NoPhotography } from "@mui/icons-material";

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
      : formatDate({ date: utcDate, language });

  return (
    <TileContainer $active={active}>
      {rented ? (
        <RentedBadge>{t("common.rented")}</RentedBadge>
      ) : (
        <AvailabilityBadge>{formattedDate}</AvailabilityBadge>
      )}
      <TileInner $rented={rented}>
        <Link to={`/listings/${id}`}>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            {images.length ? (
              <ImageCarousel
                images={images}
                onClick={(index) => navigate(`/listings/${id}`)}
              />
            ) : (
              <NoPhotography />
            )}
          </Paper>
        </Link>

        <TileContent>
          {title && <Title color="text">{title}</Title>}
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
