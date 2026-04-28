import {
  Grid,
  PaletteMode,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Paper,
  Box,
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
import { useEffect, useMemo, useState, useCallback } from "react";
import Tile from "./Tile";
import { Feature } from "../../components/Map/Map.types";
import Filters from "./Filters";
import { FilterOptions, FilterTypes } from "./Filters/Fitlers.types";
import { Tune, Help } from "@mui/icons-material";
import Header from "components/Header";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils";
import { useGeocodedLocations } from "../../geocode";
import { EXTERNAL_URLS } from "../../constants";
import { NotFoundContainer } from "../NotFound/NotFound.styles";
import { NotFoundCard, NotFoundTitle, NotFoundBody } from "../NotFound/NotFound.styles";

const LISTINGS_QUERY = gql`
  query (
    $locale: String
    $priceMin: Float
    $priceMax: Float
    $bedroomsIn: [Int]
    $bathroomsIn: [Int]
    $cityIn: [String]
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
        city_in: $cityIn
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
        amenities
        videoTourLink
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
    t,
    i18n: { language },
  } = useTranslation();

  // Get and restore user's preferred view from localStorage
  const savedView = localStorage.getItem("listingsView");

  const [view, setView] = useState<"map" | "list">(
    (savedView as "map" | "list") || "list"
  );
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterTypes>({});
  // Bump to force the <Filters> sidebar to remount with fresh local state
  // (when resetting filters from the "No units match" card, for example).
  const [filtersResetKey, setFiltersResetKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const navigate = useNavigate();

  const resetAllFilters = () => {
    setFilters({});
    setIsSidebarOpen(false);
    setFiltersResetKey(k => k + 1);
  };

  // Determine whether any non-default filter is active
  const filtersActive = useMemo(() => {
    return Object.values(filters).some((v) => {
      if (v === undefined || v === null) return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    });
  }, [filters]);

  // Fetch listings from Contentful with current filters
  const { data, loading } = useQuery(LISTINGS_QUERY, {
    variables: {
      locale: language,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      bedroomsIn: filters.bedroomsIn,
      bathroomsIn: filters.bathroomsIn,
      cityIn: filters.cityIn,
      amenitiesContainsAll: filters.amenitiesContainsAll,
      availableDate: filters.availableDate,
    },
    errorPolicy: "all",
  });

  // Capture the available filter options from the first (unfiltered) data load.
  // Computed once, never re-derived, so the option buttons don't disappear as
  // the user narrows their search.
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    bedrooms: [],
    bathrooms: [],
    cities: [],
    sqftMin: 0,
    sqftMax: 5000,
    amenities: [],
  });
  useEffect(() => {
    if (filterOptions.bedrooms.length || !data?.listingCollection?.items?.length) return;
    const nonRented = data.listingCollection.items.filter((l: any) => !l.rented);
    const sqftValues = nonRented.map((l: any) => l.squareFootage).filter(Boolean) as number[];
    const allAmenities = nonRented.reduce((acc: string[], l: any) => acc.concat(l.amenities || []), [] as string[]).filter(Boolean);
    setFilterOptions({
      bedrooms: Array.from(new Set([1].concat(nonRented.map((l: any) => l.bedrooms).filter(Boolean) as number[]))).sort((a, b) => a - b),
      bathrooms: Array.from(new Set([1].concat(nonRented.map((l: any) => l.bathrooms).filter(Boolean) as number[]))).sort((a, b) => a - b),
      cities: Array.from(new Set(nonRented.map((l: any) => l.city).filter(Boolean) as string[])).sort(),
      sqftMin: sqftValues.length ? Math.min(...sqftValues) : 0,
      sqftMax: sqftValues.length ? Math.max(...sqftValues) : 5000,
      amenities: Array.from(new Set<string>(allAmenities)).sort(),
    });
  }, [data, filterOptions.bedrooms.length]);

  // Persist user's view preference to localStorage
  useEffect(() => {
    localStorage.setItem("listingsView", view);
  }, [view]);

  // Client-side sqft filter (Contentful doesn't support squareFootage range queries).
  const matchesSqft = (listing: any) => {
    const sf = listing.squareFootage;
    if (!sf) return true;
    if (filters.sqftMin && sf < filters.sqftMin) return false;
    if (filters.sqftMax && sf > filters.sqftMax) return false;
    return true;
  };

  // Non-rented listings — the source for both map pins and geocoding fallback.
  const visibleListings = useMemo(
    () =>
      !loading && data?.listingCollection?.items?.length
        ? data.listingCollection.items.filter((l: any) => !l.rented && matchesSqft(l))
        : [],
    [data, loading, filters.sqftMin, filters.sqftMax], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Geocodes any listing whose Contentful `location` is empty but has an `address`.
  const geocodedById = useGeocodedLocations(visibleListings);

  // Transform listings data into map features format, dropping any listing we
  // still can't resolve a location for (so the map never receives null coords).
  const features = useMemo(() => {
    return visibleListings
      .map((listing: any) => {
        const location = listing.location ?? geocodedById[listing.sys.id] ?? null;
        if (!location) return null;
        return {
          id: listing.sys.id,
          title: listing.title,
          location,
          images: listing.imagesCollection.items.filter((x: any) => x),
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          squareFootage: listing.squareFootage,
          address: listing.city,
          availableDate: listing.availableDate,
          videoTourLink: listing.videoTourLink,
        };
      })
      .filter(Boolean);
  }, [visibleListings, geocodedById]);

  /**
   * Handler for when a map popup/marker is clicked
   * Highlights the corresponding listing in the list view
   */
  const handlePopupClick = useCallback((feature: Feature) => {
    setActiveListingId(feature.id);
  }, [setActiveListingId]);

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
        filtersActive={filtersActive}
        onBookVisit={() => setBookDialogOpen(true)}
      />

      <ViewContainer>
        <View $sidebarOpen={isSidebarOpen}>
          <ViewInner>
            {view === "map" && (
  <MapContainer>
    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', padding: 40 }}>
        <div className="loader" />
      </div>
    ) : !features?.length ? (
      <Tiles>
        <Grid container>
          <Grid item xs={12}>
            <NotFoundContainer>
              <NotFoundCard>
                <NotFoundTitle variant="h4">Sorry :( <p>No units match your criterias.</p></NotFoundTitle>
                <NotFoundBody>
                  Try adjusting your filters or reset them to see all listings again.
                  <p>You may contact STABL3 to ask about unlisted options.</p>
                </NotFoundBody>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={resetAllFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    startIcon={<Help />} 
                    variant="outlined" 
                    size="large"
                    href={EXTERNAL_URLS.EMAIL}
                  >
                    Contact Us
                  </Button>
                </div>
              </NotFoundCard>
            </NotFoundContainer>
          </Grid>
        </Grid>
      </Tiles>
    ) : (
      <Map features={features} onPopupClick={handlePopupClick} />
    )}
  </MapContainer>
)}

            {view === "list" && (
              // While the listing data is loading, avoid showing the NotFound UI to prevent a flash
              loading ? (
                <Tiles>
                  <Grid container>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <div className="loader" />
                      </div>
                    </Grid>
                  </Grid>
                </Tiles>
              ) : (
                // If there are no listings returned for the current filters, show the NotFound-style card
                !(features?.length) ? (
                  <Tiles>
                    <Grid container>
                      <Grid item xs={12}>
                        <NotFoundContainer>
                          <NotFoundCard>
                            <NotFoundTitle variant="h4">Sorry :( <p>No units match your criterias.</p></NotFoundTitle>
                            <NotFoundBody>
                              Try adjusting your filters or reset them to see all listings again.
                              <p>You may contact STABL3 to ask about unlisted options.</p>
                            </NotFoundBody>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={resetAllFilters}
                              >
                                Reset Filters
                              </Button>

                              <Button 
                                startIcon={<Help />} 
                                variant="outlined" 
                                size="large"
                                href={EXTERNAL_URLS.EMAIL}
                              >
                                Contact Us
                              </Button>
                            </div>
                            
                          </NotFoundCard>
                        </NotFoundContainer>
                      </Grid>
                    </Grid>
                  </Tiles>
                ) : (
                  <Tiles>
                    <Grid container spacing={3}>
                      {data?.listingCollection.items
                        .filter((listing: any) => listing.rented || matchesSqft(listing))
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
                                videoTourLink={listing.videoTourLink}
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
            <Filters key={filtersResetKey} filters={filters} setFilters={setFilters} options={filterOptions} onClose={() => setIsSidebarOpen(false)} />
          </FiltersContainer>
        </Sidebar>

        <SidebarButton
          color="primary"
          size="large"
          active={filtersActive}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Tune fontSize="large" />
        </SidebarButton>
      </ViewContainer>

      {/* Unit selection dialog — shown when BOOK A VISIT is clicked from the main listings page */}
      <Dialog
        open={bookDialogOpen}
        onClose={() => setBookDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
        slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.75)" } } }}
      >
        <DialogTitle sx={{ pb: 0.5, textAlign: "center", fontSize: "1.75rem", fontWeight: 700 }}>
          Which unit would you like to visit?
          <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5, fontWeight: 300, textAlign: "center" }}>
            Select a listing below to continue
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          {(() => {
            const available = (data?.listingCollection?.items?.filter((l: any) => !l.rented) ?? []).slice().reverse();
            if (!available.length) {
              return (
                <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No units are currently available. Try resetting your filters.
                </Typography>
              );
            }
            return (
              <Grid container spacing={2} alignItems="stretch">
                {available.map((listing: any) => {
                  const firstImage = listing.imagesCollection?.items?.[0];
                  const today = new Date();
                  const availDate = listing.availableDate ? new Date(listing.availableDate) : null;
                  const utcDate = availDate
                    ? new Date(availDate.getUTCFullYear(), availDate.getUTCMonth(), availDate.getUTCDate())
                    : null;
                  const formattedDate = availDate
                    ? availDate < today
                      ? t("common.availableNow")
                      : formatDate({ date: utcDate!, language })
                    : null;

                  return (
                    <Grid item xs={12} sm={6} key={listing.sys.id} sx={{ display: "flex" }}>
                      <Paper
                        elevation={2}
                        onClick={() => {
                          setBookDialogOpen(false);
                          navigate(`/listings/${listing.sys.id}/book`);
                        }}
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
                          {firstImage && (
                            <img
                              src={firstImage.url}
                              alt={firstImage.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          )}
                          {formattedDate && (
                            <Box sx={{
                              position: "absolute", top: 10, left: 10,
                              bgcolor: "primary.main", color: "primary.contrastText",
                              px: 1.5, py: 0.5, borderRadius: 1,
                              fontSize: "0.8rem", fontWeight: 700, pointerEvents: "none",
                            }}>
                              {formattedDate}
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ textAlign: "center" }}>
                            {listing.title}
                          </Typography>
                          {listing.shortKeyDescription && (
                            <Typography variant="body2" sx={{ textAlign: "center", fontStyle: "italic" }}>
                              {listing.shortKeyDescription}
                            </Typography>
                          )}
                          {!!(listing.bedrooms || listing.bathrooms) && (
                            <Typography variant="body2" sx={{ textAlign: "center" }}>
                              {!!listing.bedrooms && <span>{listing.bedrooms} {t("common.bed")}</span>}
                              {!!(listing.bedrooms && listing.bathrooms) && " / "}
                              {!!listing.bathrooms && <span>{listing.bathrooms} {t("common.bath")}</span>}
                              {!!(listing.bedrooms || listing.bathrooms) && listing.squareFootage && " • "}
                              {listing.squareFootage && <span>{listing.squareFootage} {t("common.sqft")}</span>}
                            </Typography>
                          )}
                          {listing.price && (
                            <Typography variant="body2" sx={{ textAlign: "center" }}>
                              {formatCurrency({ amount: listing.price, language })} / {t("common.month")}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })()}
        </DialogContent>
      </Dialog>
    </ListingsContainer>
  );
};

export default Listings;
