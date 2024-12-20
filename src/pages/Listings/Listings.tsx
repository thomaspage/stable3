import {
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  PaletteMode,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FiltersContainer,
  ListView,
  ListingsContainer,
  MapContainer,
  ViewContainer,
  Sidebar,
  Tiles,
  View,
  ViewInner,
  SidebarButton,
  SidebarHamburger,
  Logo,
  HeaderContainer,
  HeaderOptions,
  FilterButton,
} from "./Listings.styles";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";
import { gql, useQuery } from "@apollo/client";
import Map from "../../components/Map";
import { useEffect, useMemo, useState } from "react";
import Tile from "./Tile";
import { formatAddress } from "../../utils";
import { Feature } from "../../components/Map/Map.types";
import Filters from "./Filters";
import { FilterTypes } from "./Filters/Fitlers.types";
import MapIcon from "@mui/icons-material/Map";
import ListIcon from "@mui/icons-material/List";
import LanguageSelector from "../../components/LanguageSelector";
import { Tune } from "@mui/icons-material";
import Hamburger from "../../components/Hamburger";
import logoDark from "../../assets/logoDark.png";
import logoLight from "../../assets/logoLight.png";
import ThemeSelector from "components/ThemeSelector";

const LISTINGS_QUERY = gql`
  query (
    $locale: String
    $priceMin: Float
    $priceMax: Float
    $bedroomsIn: [Int]
    $bathroomsIn: [Int]
    $amenitiesContainsAll: [String]
    $availableDate: DateTime
  ) {
    listingCollection(
      locale: $locale
      order: availableDate_DESC
      where: {
        price_lte: $priceMax
        price_gte: $priceMin
        bedrooms_in: $bedroomsIn
        bathrooms_in: $bathroomsIn
        amenities_contains_all: $amenitiesContainsAll
        OR: [
          { availableDate_exists: false }
          {
            AND: [
              { availableDate_exists: true }
              { availableDate_lte: $availableDate }
            ]
          }
        ]
      }
    ) {
      items {
        sys {
          id
        }
        location {
          lat
          lon
        }
        city
        bathrooms
        bedrooms
        title
        squareFootage
        price
        availableDate
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
  }
`;

const Listings = ({ setMode }: { setMode: (mode: PaletteMode) => void }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const theme = useTheme();

  const logo = theme.palette.mode === "dark" ? logoDark : logoLight;

  const savedView = localStorage.getItem("listingsView");

  const [view, setView] = useState<"map" | "list">(
    (savedView as "map" | "list") || "list"
  );
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterTypes>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, loading, error } = useQuery(LISTINGS_QUERY, {
    variables: {
      locale: language,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      bedroomsIn: filters.bedroomsIn,
      bathroomsIn: filters.bathroomsIn,
      amenitiesContainsAll: filters.amenitiesContainsAll,
      availableDate: filters.availableDate,
    },
    errorPolicy: "all",
  });

  useEffect(() => {
    localStorage.setItem("listingsView", view);
  }, [view]);

  const features = useMemo(
    () =>
      data?.listingCollection.items.map((listing: any) => {
        return {
          id: listing.sys.id,
          title: listing.title,
          location: listing.location,
          images: listing.imagesCollection.items.filter((x: any) => x),
          price: listing.price,
        };
      }),
    [data]
  );

  const handlePopupClick = (feature: Feature) => {
    setActiveListingId(feature.id);
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "list" | "map"
  ) => {
    newView !== null && setView(newView);
  };

  return (
    <ListingsContainer>
      {/* <Typography
        style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
        variant="h3"
      >
        stabl3
      </Typography> */}

      <HeaderContainer>
        <Logo src={logo} />
        <HeaderOptions>
          <ThemeSelector setMode={setMode} />

          <LanguageSelector />

          <FilterButton
            color="primary"
            size="medium"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Tune fontSize="medium" />
          </FilterButton>

          <ToggleButtonGroup size="small" value={view} exclusive onChange={handleViewChange}>
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </HeaderOptions>
      </HeaderContainer>

      <ViewContainer>
        <View sidebarOpen={isSidebarOpen}>
          <ViewInner>
            {view === "map" && (
              <MapContainer>
                <Map features={features} onPopupClick={handlePopupClick} />
              </MapContainer>
            )}

            {view === "list" && (
              <Tiles>
                <Grid container spacing={3}>
                  {data?.listingCollection.items
                    .map((listing: any) => {
                      return (
                        <Grid
                          key={listing.sys.id}
                          item
                          xs={12}
                          md={isSidebarOpen ? 6 : 4}
                          // lg={4}
                          xl={isSidebarOpen ? 4 : 3}
                          onMouseOver={() => setActiveListingId(null)}
                        >
                          <Tile
                            id={listing.sys.id}
                            availableDate={listing.availableDate}
                            title={listing.title}
                            bathrooms={listing.bathrooms}
                            bedrooms={listing.bedrooms}
                            squareFootage={listing.squareFootage}
                            price={listing.price}
                            images={listing.imagesCollection.items.filter(
                              (x: any) => x
                            )}
                            active={activeListingId === listing.sys.id}
                          />
                        </Grid>
                      );
                    })
                    .reverse()}
                </Grid>
              </Tiles>
            )}
          </ViewInner>
        </View>

        <Sidebar open={isSidebarOpen}>
          <SidebarHamburger
            open={isSidebarOpen}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <FiltersContainer>
            <Filters filters={filters} setFilters={setFilters} />
          </FiltersContainer>
        </Sidebar>

        <SidebarButton color="primary" size="large" onClick={() => setIsSidebarOpen(true)}>
          <Tune fontSize="large" />
        </SidebarButton>
      </ViewContainer>

      {/* {view === "list" && (
        <ListView>
          <Tiles>
            <Grid container spacing={3}>
              {data?.listingCollection.items.map((listing: any) => {
                return (
                  <Grid
                    key={listing.sys.id}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                  >
                    <Tile
                      title={listing.title}
                      bedrooms={listing.bedrooms}
                      squareFootage={listing.squareFootage}
                      price={listing.price}
                      images={listing.imagesCollection.items}
                      active={activeListingId === listing.sys.id}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Tiles>
        </ListView>
      )} */}

      {/* 
      <div>
        {data.listingCollection.items.map((listing: any) => {
          return (
            <div key={listing.sys.id}>
              <Link
                to={`/listings/${listing.sys.id}`}
                onClick={() =>
                  amplitude.track("Click", { button: listing.sys.id })
                }
              >
                <Carousel autoPlay={false} animation="slide">
                  {listing.imagesCollection.items.map((image: any) => {
                    return (
                      <img
                        style={{pointerEvents: "none"}}
                        key={image.sys.id}
                        src={image.url}
                        alt={image.title}
                      />
                    );
                  })}
                </Carousel>
              </Link>
            </div>
          );
        })}
      </div> */}
    </ListingsContainer>
  );
};

export default Listings;
