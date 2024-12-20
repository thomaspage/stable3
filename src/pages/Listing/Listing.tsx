import { gql, useQuery } from "@apollo/client";
import { BedOutlined, EventAvailableOutlined, LocalAtm, LocationOnOutlined, NavigateBefore, ShowerOutlined, SpaceDashboardOutlined } from "@mui/icons-material";
import {
  Button,
  ImageListItem,
  Typography,
  Link as StyledLink
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Amenity } from "../../types";
import { formatCurrency, formatDate } from "../../utils";
import {
  AmenitiesContainer,
  BodyContainer,
  DescriptionContainer,
  HighlightsContainer,
  HightlightText,
  ListingContainer,
  StyledImageCarousel,
  StyledImageList
} from "./Listing.styles";

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
    default:
      return [
        [4, 2],
        [2, 2],
        [2, 1],
        [2, 1],
      ];
  }
};

const Listing = ({}) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(LISTING_QUERY, {
    variables: {
      id,
      locale: language,
    },
    errorPolicy: "all"
  });

  if (loading) return null;


  const price = formatCurrency({ amount: data.listing.price, language });

  const images = data.listing.imagesCollection.items.filter((x: any) => x)

  const imageLayout = getImageLayout(
    images.length
  );

    // Get available date
    const today = new Date();
    const date = new Date(data.listing.availableDate)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const formattedDate = date < today ? t("common.availableNow") : t("common.availableDate", {date: formatDate({ date: utcDate, language })});
  
  return (
    <ListingContainer>
      {/* <Typography>{t("pages.listing.message")}</Typography> */}
      
      <Button style={{position:"sticky", top: 0, zIndex: 2}} onClick={() => navigate(-1)} startIcon={<NavigateBefore />}>back</Button>

      <StyledImageList
        sx={{ width: "100%" }}
        variant="quilted"
        cols={4}
        rowHeight={100}
      >
        {images.slice(0, 4)?.map((item: any, index: number) => (
          <ImageListItem
            key={item.sys.id}
            rows={imageLayout[index][0]}
            cols={imageLayout[index][1]}
          >
            <img src={item.url} alt={item.title} loading="lazy" />
          </ImageListItem>
        ))}
      </StyledImageList>

      <StyledImageCarousel
        images={images}
        // onClick={() => console.log("clicked")}
        aspectRatio={1.8}
        showPreviews
      />

      <Typography fontWeight={700} variant="h4">{data.listing.title}</Typography>
      <HighlightsContainer>
        {data.listing.address && (
          <HightlightText>
            <LocationOnOutlined />
            <strong>{data.listing.location ? <Link target="_blank" to={`https://maps.google.com/?q=${data.listing.location.lat},${data.listing.location.lon}`}><StyledLink>{data.listing.address}</StyledLink></Link> : data.listing.address}</strong>
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

      <BodyContainer>
        {data.listing.description && (
          <DescriptionContainer style={{maxWidth: "100%"}}>
            <Typography variant="h5">{t("common.description")}</Typography>
            <Typography variant="body1" style={{ whiteSpace: "preserve-breaks" }}>
              {data.listing.description}
            </Typography>
          </DescriptionContainer>
        )}

        {data.listing.amenities && (
          <AmenitiesContainer>
            <Typography variant="h5">{t("common.details")}</Typography>
            {data.listing.amenities.map((amenity: Amenity) => {
              const text = t(`amenities.${amenity}`);
              return <Typography key={amenity}>- {text}</Typography>;
            })}
          </AmenitiesContainer>
        )}
      </BodyContainer>
    </ListingContainer>
  );
};

export default Listing;
