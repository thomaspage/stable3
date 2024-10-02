import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import {
  ListingContainer,
  Hotel,
  Hotels,
  HotelName,
  InlineFlex,
  MetroImg,
  WalkerImg,
  StyledImageCarousel,
  StyledImageList,
} from "./Listing.styles";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";
import { gql, useQuery } from "@apollo/client";
import { ListingProps } from "./Listing.types";
import { formatCurrency } from "../../utils";
import { NavigateBefore } from "@mui/icons-material";
import styled from "styled-components";
import { AmenityIcons } from "../../constants";
import { Amenities } from "../../types";
import ImageCarousel from "../../components/ImageCarousel";

const LISTING_QUERY = gql`
  query ($id: String!, $locale: String) {
    listing(id: $id, locale: $locale) {
      sys {
        id
      }
      price
      title
      amenities
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

  return (
    <ListingContainer>
      {/* <Typography>{t("pages.listing.message")}</Typography> */}

      <Link to="/listings">
        <Button startIcon={<NavigateBefore />}>back</Button>
      </Link>
      

      <StyledImageList
        sx={{ width: "100%" }}
        variant="quilted"
        cols={4}
        rowHeight={100}
      >
        {images
          .slice(0, 4)
          ?.map((item: any, index: number) => (
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
        onClick={() => console.log("clicked")}
      />

      <Typography variant="h3">{data.listing.title}</Typography>
      <Typography variant="body1">{price} / mo</Typography>

      {data.listing.amenities && (
        <>
          <Typography variant="h5">Amenities</Typography>
          {data.listing.amenities.map((amenity: Amenities) => {
            const text = t(`amenities.${amenity}`);
            const Icon = AmenityIcons[amenity];
            return (
              <div>
                {Icon && <Icon />}
                <Typography key={amenity}>{text}</Typography>
              </div>
            );
          })}
        </>
      )}
    </ListingContainer>
  );
};

export default Listing;
