import { gql, useQuery } from "@apollo/client";
import {
  BedOutlined,
  EventAvailableOutlined,
  Help,
  LocalAtm,
  LocationOnOutlined,
  NavigateBefore,
  ShowerOutlined,
  SpaceDashboardOutlined,
} from "@mui/icons-material";
import {
  Button,
  ImageListItem,
  Typography,
  Link as StyledLink,
  PaletteMode,
  useTheme,
  useMediaQuery,
  Breakpoint,
  Modal,
  Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Amenity } from "../../types";
import { formatCurrency, formatDate } from "../../utils";
import {
  AmenitiesContainer,
  BodyContainer,
  ContactContainer,
  DescriptionContainer,
  DescriptionWrapper,
  HighlightsContainer,
  HightlightText,
  ImageCarouselModal,
  ListingContainer,
  MapContainer,
  MobileImageCarousel,
  StyledImageCarousel,
  StyledImageList,
  TitleContainer,
  TitleWithMap,
} from "./Listing.styles";
import Header from "components/Header";
import { useEffect, useMemo, useState } from "react";
import ImageCarousel from "components/ImageCarousel";
import Map from "components/Map";

const LISTING_QUERY = gql`
  query ($id: String!, $locale: String) {
    listing(id: $id, locale: $locale) {
      sys {
        id
      }
      price
      title
      description
      amenities
      address
      bathrooms
      bedrooms
      squareFootage
      availableDate
      rented
      location {
        lat
        lon
      }
      imagesCollection {
        items {
          sys {
            id
          }
          title
          description
          url
        }
      }
    }
  }
`;

const getImageLayout = (index: number) => {
  switch (index) {
    case 1:
      return [[4, 4]];
    case 2:
      return [
        [4, 2],
        [4, 2],
      ];
    case 3:
      return [
        [4, 2],
        [2, 2],
        [2, 2],
      ];
    case 4:
      return [
        [4, 2],
        [2, 2],
        [2, 1],
        [2, 1],
      ];
    default:
      return [
        [4, 2],
        [2, 1],
        [2, 1],
        [2, 1],
        [2, 1],
      ];
  }
};

const Listing = ({ setMode }: { setMode: (mode: PaletteMode) => void }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();

  const [startIndex, setStartIndex] = useState<number | null>(null);

  const { data, loading, error } = useQuery(LISTING_QUERY, {
    variables: {
      id,
      locale: language,
    },
    errorPolicy: "all",
  });

  const features = useMemo(
    () =>
      data?.listing?.location && [
        {
          id: data.listing.sys.id,
          title: data.listing.title,
          location: data.listing.location,
          images: data.listing.imagesCollection.items.filter((x: any) => x),
          price: data.listing.price,
        },
      ],
    [data]
  );

  if (loading) return null;

  if (data && (!data.listing || data.listing.rented)) {
    setTimeout(() => navigate("/"), 0);
    return null;
  }

  const price = formatCurrency({ amount: data.listing.price, language });

  const images = data.listing.imagesCollection.items.filter((x: any) => x);

  const imageLayout = getImageLayout(images.length);

  // Get available date
  const today = new Date();
  const date = new Date(data.listing.availableDate);
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const formattedDate =
    date < today
      ? t("common.availableNow")
      : t("common.availableDate", {
          date: formatDate({ date: utcDate, language }),
        });

  return (
    <ListingContainer>
      {/* <Typography>{t("pages.listing.message")}</Typography> */}

      <Header setMode={setMode} />

      <Button
        style={{ position: "sticky", top: 0, zIndex: 2 }}
        onClick={() => navigate(-1)}
        startIcon={<NavigateBefore />}
      >
        back
      </Button>

      <StyledImageList
        sx={{ width: "100%" }}
        variant="quilted"
        cols={4}
        rowHeight={100}
      >
        {images.slice(0, 5)?.map((item: any, index: number) => (
          <ImageListItem
            key={item.sys.id}
            rows={imageLayout[index][0]}
            cols={imageLayout[index][1]}
            onClick={() => setStartIndex(index)}
          >
            <img src={item.url} alt={item.title} loading="lazy" />
          </ImageListItem>
        ))}
      </StyledImageList>

      <MobileImageCarousel>
        <StyledImageCarousel images={images} aspectRatio={1.8} showPreviews />
      </MobileImageCarousel>

      <ImageCarouselModal
        open={startIndex !== null}
        onClose={() => setStartIndex(null)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Container maxWidth="lg">
          <ImageCarousel
            images={images}
            aspectRatio={1.8}
            showPreviews
            startIndex={startIndex || 0}
          />
        </Container>
      </ImageCarouselModal>

      <TitleWithMap>
        <TitleContainer>
          <Typography fontWeight={700} variant="h4">
            {data.listing.title}
          </Typography>
          <HighlightsContainer>
            {data.listing.address && (
              <HightlightText>
                <LocationOnOutlined />
                <strong>
                  {data.listing.location ? (
                    <StyledLink
                      target="_blank"
                      href={`https://maps.google.com/?q=${data.listing.location.lat},${data.listing.location.lon}`}
                    >
                      {data.listing.address}
                    </StyledLink>
                  ) : (
                    data.listing.address
                  )}
                </strong>
              </HightlightText>
            )}
            {data.listing.price && (
              <HightlightText>
                <LocalAtm />
                {price} / {t("common.month")}
              </HightlightText>
            )}
            {!!data.listing.bedrooms && (
              <HightlightText>
                <BedOutlined /> {data.listing.bedrooms}{" "}
                {data.listing.bedrooms > 1
                  ? t("common.bedrooms")
                  : t("common.bedroom")}
              </HightlightText>
            )}
            {!!data.listing.bathrooms && (
              <HightlightText>
                <ShowerOutlined /> {data.listing.bathrooms}{" "}
                {data.listing.bathrooms > 1
                  ? t("common.bathrooms")
                  : t("common.bathroom")}
              </HightlightText>
            )}
            {data.listing.squareFootage && (
              <HightlightText>
                <SpaceDashboardOutlined />
                {data.listing.squareFootage} {t("common.sqft")}
              </HightlightText>
            )}
            {formattedDate && (
              <HightlightText>
                <EventAvailableOutlined />
                {formattedDate}
              </HightlightText>
            )}
          </HighlightsContainer>
        </TitleContainer>
        <MapContainer>
          <Map features={features} />
        </MapContainer>
      </TitleWithMap>

      <BodyContainer>
        <DescriptionWrapper>
          {data.listing.description && (
            <DescriptionContainer style={{ maxWidth: "100%" }}>
              <Typography variant="h5">{t("common.description")}</Typography>
              <Typography
                variant="body1"
                style={{ whiteSpace: "preserve-breaks" }}
              >
                {data.listing.description}
              </Typography>
            </DescriptionContainer>
          )}
          <ContactContainer>
            <Button
              variant="contained"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdiyd8JK8_U-QHjvppensyQkHpMouI8b2cP6O6N_tfTjwZngw/viewform?usp=sf_link"
              target="_blank"
            >
              {t("common.apply")}
            </Button>
            <Button startIcon={<Help />} variant="outlined" href="mailto:stabl3.rental@gmail.com">
              stabl3.rental@gmail.com
            </Button>
          </ContactContainer>
        </DescriptionWrapper>

        {data.listing.amenities && (
          <AmenitiesContainer>
            <Typography variant="h5">{t("common.details")}</Typography>
            <div style={{columnCount: 2}}>
              {data.listing.amenities.map((amenity: Amenity) => {
                const text = t(`amenities.${amenity}`);
                return <Typography key={amenity}>- {text}</Typography>;
              })}
            </div>
          </AmenitiesContainer>
        )}
      </BodyContainer>
    </ListingContainer>
  );
};

export default Listing;
