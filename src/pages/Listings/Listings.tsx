import {
  Grid,
  PaletteMode,
  useTheme,
  Button,
} from "@mui/material";
import {
  FiltersContainer,
  ListingsContainer,
  MapContainer,
  ViewContainer,
  Sidebar,
  Tiles,
  View,
  ViewInner,
  SidebarButton,
  SidebarHamburger,
} from "./Listings.styles";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import Map from "../../components/Map";
import { useEffect, useMemo, useState } from "react";
import Tile from "./Tile";
import { Feature } from "../../components/Map/Map.types";
import Filters from "./Filters";
import { FilterTypes } from "./Filters/Fitlers.types";
import { Tune } from "@mui/icons-material";
import Header from "components/Header";
import { NotFoundContainer } from "../NotFound/NotFound.styles";
import { NotFoundCard, NotFoundTitle, NotFoundBody } from "../NotFound/NotFound.styles";

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
      order: [rented_DESC, availableDate_DESC]
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
        rented
        availableDate
        shortKeyDescription
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
    i18n: { language },
  } = useTranslation();

  // Get and restore user's preferred view from localStorage
  const savedView = localStorage.getItem("listingsView");

  const [view, setView] = useState<"map" | "list">(
    (savedView as "map" | "list") || "list"
  );
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterTypes>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch listings from Contentful with current filters
  const { data } = useQuery(LISTINGS_QUERY, {
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

  // Persist user's view preference to localStorage
  useEffect(() => {
    localStorage.setItem("listingsView", view);
  }, [view]);

  // Transform listings data into map features format
  const features = useMemo(
    () =>
      data?.listingCollection.items
        .filter((listing: any) => !listing.rented)
        .map((listing: any) => ({
          id: listing.sys.id,
          title: listing.title,
          location: listing.location,
          images: listing.imagesCollection.items.filter((x: any) => x),
          price: listing.price,
        })),
    [data]
  );

  /**
   * Handler for when a map popup/marker is clicked
   * Highlights the corresponding listing in the list view
   */
  const handlePopupClick = (feature: Feature) => {
    setActiveListingId(feature.id);
  };

  /**
   * Handler for toggling between map and list views
   */
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "list" | "map"
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <ListingsContainer>
      <Header
        setMode={setMode}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleViewChange={handleViewChange}
        view={view}
      />

      <ViewContainer>
        <View $sidebarOpen={isSidebarOpen}>
          <ViewInner>
            {view === "map" && (
              <MapContainer>
                <Map features={features} onPopupClick={handlePopupClick} />
              </MapContainer>
            )}

            {view === "list" && (
              // If there are no listings returned for the current filters, show the NotFound-style card
              !(features?.length) ? (
                <Tiles>
                  <Grid container>
                    <Grid item xs={12}>
                      <NotFoundContainer>
                        <NotFoundCard>
                          <NotFoundTitle variant="h4">No units available</NotFoundTitle>
                          <NotFoundBody>
                            Sorry, there are no listings that match your filters. Try
                            adjusting your filters or reset them to see all listings again.
                          </NotFoundBody>

                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => {
                              setFilters({});
                              setIsSidebarOpen(false);
                            }}
                          >
                            Reset filters
                          </Button>
                        </NotFoundCard>
                      </NotFoundContainer>
                    </Grid>
                  </Grid>
                </Tiles>
              ) : (
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
                            xl={isSidebarOpen ? 4 : 3}
                            onMouseOver={() => setActiveListingId(null)}
                          >
                            <Tile
                              id={listing.sys.id}
                              availableDate={listing.availableDate}
                              title={listing.title}
                              description={listing.shortKeyDescription}
                              bathrooms={listing.bathrooms}
                              bedrooms={listing.bedrooms}
                              squareFootage={listing.squareFootage}
                              price={listing.price}
                              images={listing.imagesCollection.items.filter(
                                (x: any) => x
                              )}
                              active={activeListingId === listing.sys.id}
                              rented={listing.rented}
                            />
                          </Grid>
                        );
                      })
                      .reverse()}
                  </Grid>
                </Tiles>
              )
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

        <SidebarButton
          color="primary"
          size="large"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Tune fontSize="large" />
        </SidebarButton>
      </ViewContainer>
    </ListingsContainer>
  );
};

export default Listings;
