import { Typography } from "@mui/material";
import {
  ListingsContainer,
  Hotel,
  Hotels,
  HotelName,
  InlineFlex,
  MetroImg,
  WalkerImg,
} from "./Listings.styles";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";
import { gql, useQuery } from "@apollo/client";

const LISTINGS_QUERY = gql`
{
  listingCollection {
    items {
      sys {
        id
      }
      # add the fields you want to query
    }
  }
}
`;

const Listings = ({}) => {
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(LISTINGS_QUERY);

  console.log("loading", loading);
  console.log("data", data);
  console.log("error", error)


  return (
    <ListingsContainer>
      <Typography>{t("pages.listings.message")}</Typography>

      <Hotels>
        <Hotel>
          <Link
            to="https://hotelbirksmontreal.com/"
            target="blank"
            onClick={() => amplitude.track("Click", { button: "Hôtel Birks" })}
          >
            <HotelName>Hôtel Birks</HotelName>
          </Link>
          <InlineFlex>
            <WalkerImg />
            <Typography>2 min</Typography>
          </InlineFlex>
        </Hotel>
        <Hotel>
          <Link
            to="https://www.marriott.com/en-us/hotels/yulmd-renaissance-montreal-downtown-hotel/overview/"
            onClick={() => amplitude.track("Click", { button: "Renaissance" })}
            target="blank"
          >
            <HotelName>Renaissance</HotelName>
          </Link>
          <InlineFlex>
            <WalkerImg />
            <Typography>3 min</Typography>
          </InlineFlex>
        </Hotel>
        <Hotel>
          <Link
            to="https://www.marriott.com/en-us/hotels/yuldt-courtyard-montreal-downtown/overview/"
            onClick={() =>
              amplitude.track("Click", { button: "Courtyard Marriott" })
            }
            target="blank"
          >
            <HotelName>Courtyard Marriott</HotelName>
          </Link>
          <InlineFlex>
            <WalkerImg />
            <Typography>6 min</Typography>
          </InlineFlex>
        </Hotel>
      </Hotels>

      {/* <br />
      <br />

      <Hotel>
        <InlineFlex>
          <Typography variant="h3">McGill Metro</Typography>
          <MetroImg />
        </InlineFlex>
        <InlineFlex>
          <WalkerImg />
          <Typography>5 min</Typography>
        </InlineFlex>
      </Hotel> */}
    </ListingsContainer>
  );
};

export default Listings;
