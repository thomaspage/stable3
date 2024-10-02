import { Paper, Typography } from "@mui/material";
import ImageCarousel from "../../../components/ImageCarousel";
import { AvailabilityBadge, TileContainer, TileContent, Title } from "./Tile.style";
import { TileProps } from "./Tile.types";
import { formatCurrency, formatDate, getMonth } from "../../../utils";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { NoPhotography } from "@mui/icons-material";

const Tile = ({
  id,
  title,
  // description,
  availableDate,
  price,
  bedrooms,
  // rating,
  // thumbnail,
  images,
  squareFootage,
  active,
}: // fullAddress
TileProps) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const navigate = useNavigate();

  // Get available date
  const today = new Date();
  const date = new Date(availableDate);
  const formattedDate = date < today ? t("common.availableNow") : getMonth({ date, language });

  return (
    <TileContainer $active={active}>
      <AvailabilityBadge>{formattedDate}</AvailabilityBadge>
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
        {bedrooms && <Typography>{bedrooms} bedrooms</Typography>}
        {squareFootage && <Typography>{squareFootage} {t("ft")}²</Typography>}

        {price && (
          <Typography>
            {formatCurrency({ amount: price, language })} {t("perMonth")}
          </Typography>
        )}
      </TileContent>
    </TileContainer>
  );
};

export default Tile;
