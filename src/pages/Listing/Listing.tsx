import { gql, useQuery } from "@apollo/client";
import {
  BedOutlined,
  EventAvailableOutlined,
  Help,
  LocalAtm,
  LocationOnOutlined,
  NavigateBefore,
  PlayArrow,
  ShowerOutlined,
  SpaceDashboardOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  ImageListItem,
  Modal,
  Paper,
  Typography,
  Link as StyledLink,
  PaletteMode,
  Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Amenity } from "../../types";
import { formatCurrency, formatDate } from "../../utils";
import {
  AmenitiesContainer,
  AmenitiesList,
  BodyContainer,
  ContactContainer,
  DescriptionContainer,
  DescriptionWrapper,
  ImageCarouselModal,
  ListingContainer,
  MapContainer,
  MobileImageCarousel,
  StyledImageCarousel,
  StyledImageList,
  TitleContainer,
  TitleText,
  TitleWithMap,
} from "./Listing.styles";
import Header from "components/Header";
import { useMemo, useState, useEffect } from "react";
import ImageCarousel from "components/ImageCarousel";
import Map from "components/Map";
import { EXTERNAL_URLS } from "../../constants";
import { useGeocodedLocation, useReverseGeocodedAddress } from "../../geocode";

// Short display labels for each Contentful amenity value.
// Grouped to match the three UI sections in render order.
const AMENITY_LABELS: Record<string, string> = {
  // ── Inclusions / Exclusions ──
  // Utilities
  
  // Air conditioning
  "Air Conditionning Included (Central)":   "Central A/C Included",
  "Air Conditionning Included (Wall Unit)": "Wall Unit A/C Included",
  // Appliances
  "Appliances Excluded":                    "No Appliances Included",
  "Refrigerator Included":                  "Refrigerator Included",
  "Stove Included":                         "Stove Included",
  "Washer Included":                        "Washer Included",
  "Dryer Included":                         "Dryer Included",
  "Dishwasher Included":                    "Dishwasher Included",
  "Dishwasher Excluded":                    "Dishwasher Excluded",
  // Laundry
  "Washer Dryer Connections":               "Washer/Dryer Hookups Available",
  "Shared Laundry Room":                    "Shared Laundry Room",
  // Parking
  "Parking on Street Available":            "Street Parking Available",
  "Indoor Parking Available":               "Indoor/Garage Parking",
  // Furnishings
  "Furnished Unit":                         "Fully Furnished",
  "Partly Furnished":                       "Partly Furnished",

  // ── Pet Policy ──
  "Pets Not Accepted":                      "No Pets Accepted",
  "Pets Accepted":                          "Pets Welcome",
  "Cats Accepted":                          "Cats Welcome",
  "Dogs Accepted":                          "Dogs Welcome",
  "1 Dog Accepted":                         "1x Dog Welcome",
  "1 Cat Accepted":                         "1x Cat Welcome",

  // ── Additional Features ──
  // Spotlight (always shown first)
  "Clean Prior Tenants":                    "Clean Prior Tenants",
  // Kitchen
  "Full Size Pantry":                       "Full-size Pantry",
  // Floor / unit configuration
  "On Two Floors (In-Unit Staircase)":      "Two-Floor Unit (in-unit stairs)",
  // Building quality
  "New":                                    "New Building",
  "Luxury":                                 "Luxury Building",
  "Recent Renovations":                     "Recently Renovated",
  // Unit features
  "Balcony/Patio Included":                 "Balcony / Patio Included",
  "Exterior Storage Available":             "Exterior Storage Included",
  // Building amenities
  "Alarm System Available":                 "Alarm System",
  "Elevator Available":                     "Elevator",
  "Lobby Available":                        "Entrance Lobby",
  "Secured Entry Available":                "Secured Entry",
  "Concierge On-site":                      "Concierge On-site",
  // Proximity
  "Close to Gym":                           "Near Gym",
  "Close to Public Transit":                "Near Public Transit",
  "Close to Daycare":                       "Near Daycare",

  // ── Consolidated / synthetic markers (produced by consolidateAmenities) ──
  "__hydroHeatingIncluded":                 "Hydro and Heating Included",
  "__hydroHeatingExcluded":                 "Hydro and Heating Excluded",
  // Main-appliance rollups are produced dynamically as "__mainAppliances:Fridge,Stove,..." — see getAmenityLabel
};

// Short display names for the 5 "main" appliances. Iteration order determines
// the order they appear inside the dynamic rollup label.
const MAIN_APPLIANCE_SHORT_NAMES: Record<string, string> = {
  "Refrigerator Included": "Fridge",
  "Stove Included":        "Stove",
  "Washer Included":       "Washer",
  "Dryer Included":        "Dryer",
  "Dishwasher Included":   "Dishwasher",
};

const MAIN_APPLIANCES_PREFIX = "__mainAppliances:";

// Merges related amenities into a single bullet when thresholds are met:
//   - 2+ main appliances → "Nx Appliances Included (Fridge, Stove, ...)" (list is dynamic)
//   - electricity + heating both included/excluded → "Hydro and Heating Included/Excluded"
const consolidateAmenities = (list: string[]): string[] => {
  const source = new Set(list);
  const out = new Set<string>(list);

  const mains = Object.keys(MAIN_APPLIANCE_SHORT_NAMES).filter(a => source.has(a));
  if (mains.length >= 2) {
    mains.forEach(a => out.delete(a));
    const shortNames = mains.map(a => MAIN_APPLIANCE_SHORT_NAMES[a]).join(",");
    out.add(`${MAIN_APPLIANCES_PREFIX}${shortNames}`);
  }

  if (source.has("Electricity Included") && source.has("Heating Included")) {
    out.delete("Electricity Included");
    out.delete("Heating Included");
    out.add("__hydroHeatingIncluded");
  }
  if (source.has("Electricity Excluded") && source.has("Heating Excluded")) {
    out.delete("Electricity Excluded");
    out.delete("Heating Excluded");
    out.add("__hydroHeatingExcluded");
  }

  return Array.from(out);
};

// Resolves an amenity to its display label. Handles both static label lookups
// and the dynamic "__mainAppliances:Fridge,Stove,Washer" marker.
const getAmenityLabel = (amenity: string): string => {
  if (amenity.startsWith(MAIN_APPLIANCES_PREFIX)) {
    const names = amenity.substring(MAIN_APPLIANCES_PREFIX.length).split(",");
    return `${names.length}x Appliances Included (${names.join(", ")})`;
  }
  return AMENITY_LABELS[amenity] ?? amenity;
};

// Auto-catches any new Contentful amenity whose name contains one of these
// words into Inclusions / Exclusions. `\b` word boundaries prevent accidental
// substring matches (e.g. "Carpets" won't match "pet").
const INCLUSION_KEYWORD_REGEX =
  /\b(fridge|refrigerator|freezer|oven|range|stove|microwave|dishwasher|washer|dryer|laundry|electric|electricity|hydro|gas|utilities?|parking|garage|carport|heating|heat ?pump|air ?condition(?:n)?ing|a\/c|ac|wi-?fi|internet|ethernet|fiber|furnished)\b/i;

const isInclusionAmenity = (amenity: string): boolean =>
  INCLUSION_AMENITIES.has(amenity) ||
  amenity.startsWith(MAIN_APPLIANCES_PREFIX) ||
  INCLUSION_KEYWORD_REGEX.test(amenity);

// Auto-sorts any new Contentful amenity containing a pet-related word into Pet Policy.
const PET_KEYWORD_REGEX = /\b(pet|pets|dog|dogs|cat|cats|animal|animals)\b/i;
const isPetAmenity = (amenity: string): boolean =>
  PET_AMENITIES.has(amenity) || PET_KEYWORD_REGEX.test(amenity);

// Display-order priority inside each section (lower = earlier).
// Unknown amenities land at the end of their section.
const INCLUSION_PRIORITY: Record<string, number> = {
  // 1 — Hydro / Heating
  "__hydroHeatingIncluded":                 10,
  "__hydroHeatingExcluded":                 11,
  "Electricity Included":                   12,
  "Electricity Excluded":                   13,
  "Heating Included":                       14,
  "Heating Excluded":                       15,
  // 2 — Appliances (dynamic rollup sits at start, see getInclusionPriority)
  "Appliances Excluded":                    21,
  "Refrigerator Included":                  22,
  "Stove Included":                         23,
  "Washer Included":                        24,
  "Dryer Included":                         25,
  "Dishwasher Included":                    26,
  "Dishwasher Excluded":                    27,
  // 3 — Laundry
  "Washer Dryer Connections":               30,
  "Shared Laundry Room":                    31,
  // 4 — Parking
  "One Parking Available":                  40,
  "Two Parking Available":                  41,
  "Parking on Street Available":            42,
  "Indoor Parking Available":               43,
  // 5 — A/C
  "Air Conditionning Included (Central)":   50,
  "Air Conditionning Included (Wall Unit)": 51,
  // 6 — Internet
  "Internet Included":                      60,
  // 7 — Furnishings
  "Furnished Unit":                         70,
  "Partly Furnished":                       71,
};

const FEATURE_PRIORITY: Record<string, number> = {
  // 0 — Spotlight (exceptional — always first)
  "Clean Prior Tenants":                    0,
  // 1 — Floor / unit configuration
  "Lowest Floor":                           10,
  "Ground Floor":                           11,
  "2nd Floor":                              12,
  "3rd Floor":                              13,
  "Highest Floor":                          14,
  "On Two Floors (In-Unit Staircase)":      15,
  // 2 — Unit space (balcony, pantry, rooftop-like)
  "Balcony/Patio Included":                 20,
  "Full Size Pantry":                       21,
  // 3 — Other unit-level features / quality
  "Exterior Storage Available":             30,
  "New":                                    31,
  "Luxury":                                 32,
  "Recent Renovations":                     33,
  // 4 — Building features
  "Alarm System Available":                 40,
  "Elevator Available":                     41,
  "Lobby Available":                        42,
  "Secured Entry Available":                43,
  "Concierge On-site":                      44,
  // 5 — Proximity ("close to …") — always last
  "Close to Gym":                           100,
  "Close to Public Transit":                101,
  "Close to Daycare":                       102,
};

const getInclusionPriority = (amenity: string): number => {
  if (amenity.startsWith(MAIN_APPLIANCES_PREFIX)) return 20; // Rollup sits at start of appliances
  const exact = INCLUSION_PRIORITY[amenity];
  if (exact !== undefined) return exact;

  // Keyword-based fallbacks so future Contentful amenities still land in the
  // right sub-group. Each fallback is nudged to the end of its group (e.g. 19
  // for Hydro/Heating) so explicit entries keep their specified order.
  if (/\b(electric|electricity|hydro|gas|heating)\b/i.test(amenity)) return 19;
  if (/\b(fridge|refrigerator|freezer|oven|range|stove|microwave|dishwasher|appliances?)\b/i.test(amenity)) return 29;
  if (/\b(washer|dryer|laundry)\b/i.test(amenity)) return 39;
  if (/\b(parking|garage|carport|ev ?charging)\b/i.test(amenity)) return 49;
  if (/\b(a\/c|air ?condition(?:n)?ing|heat ?pump)\b/i.test(amenity)) return 59;
  if (/\b(wi-?fi|internet|ethernet|fiber)\b/i.test(amenity)) return 69;
  if (/\b(furnished|furniture)\b/i.test(amenity)) return 79;

  return 999;
};

const getFeaturePriority = (amenity: string): number => {
  const exact = FEATURE_PRIORITY[amenity];
  if (exact !== undefined) return exact;

  // Rooftop → just after Balcony/Patio (20) and Pantry (21)
  if (/\brooftop\b/i.test(amenity)) return 22;
  // Unknown proximity amenities (e.g. "Close to Park") → end of section
  if (/\b(close to|near|nearby)\b/i.test(amenity)) return 150;

  return 50; // Unknown middle-of-section feature
};

// Utilities, A/C, appliances, laundry, parking, furnishings — anything "in or out" of the unit
const INCLUSION_AMENITIES = new Set([
  // Utilities
  "Electricity Excluded", "Electricity Included",
  "Heating Excluded", "Heating Included",
  "Internet Included",
  // Air conditioning
  "Air Conditionning Included (Central)", "Air Conditionning Included (Wall Unit)",
  // Appliances
  "Appliances Excluded",
  "Refrigerator Included", "Stove Included",
  "Washer Included", "Dryer Included", "Dishwasher Included", "Dishwasher Excluded",
  // Laundry
  "Washer Dryer Connections", "Shared Laundry Room",
  // Parking
  "One Parking Available", "Two Parking Available",
  "Parking on Street Available", "Indoor Parking Available",
  // Furnishings
  "Furnished Unit", "Partly Furnished",
  // Synthetic consolidated markers (main-appliance rollup is handled by prefix check in isInclusionAmenity)
  "__hydroHeatingIncluded", "__hydroHeatingExcluded",
]);

// Anything animal-related
const PET_AMENITIES = new Set([
  "Pets Not Accepted", "Pets Accepted",
  "Cats Accepted", "Dogs Accepted",
  "1 Dog Accepted", "1 Cat Accepted",
]);

// Everything else falls into Additional Features (floor/config, building, proximity, etc.)

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
      videoTourLink
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

// Parses any common YouTube URL form to a video ID, or null if not a YT link.
const getYoutubeVideoId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

/**
 * Defines the grid layout for images based on the number of images
 * Returns an array of [rows, cols] tuples for MUI ImageList
 * @param imageCount - Number of images to display
 * @returns Array of [rows, cols] tuples defining the grid layout
 */
const getImageLayout = (imageCount: number): [number, number][] => {
  switch (imageCount) {
    case 1:
      return [[4, 4]]; // Single large image
    case 2:
      return [
        [4, 2], // Two equal vertical images
        [4, 2],
      ];
    case 3:
      return [
        [4, 2], // One large left, two stacked right
        [2, 2],
        [2, 2],
      ];
    case 4:
      return [
        [4, 2], // One large left, three on right
        [2, 2],
        [2, 1],
        [2, 1],
      ];
    default:
      return [
        [4, 2], // One large left, four small on right
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
  const [videoOpen, setVideoOpen] = useState(false);

  const { data, loading } = useQuery(LISTING_QUERY, {
    variables: {
      id,
      locale: language,
    },
    errorPolicy: "all",
  });

  // Falls back to geocoding `address` when Contentful's `location` field is empty.
  const resolvedLocation = useGeocodedLocation(
    data?.listing?.location,
    data?.listing?.address,
  );

  // Reverse-geocodes the pin when no explicit text `address` was set in Contentful,
  // so editors can fill just the Location field and the UI still shows a title.
  const reverseResult = useReverseGeocodedAddress(resolvedLocation);
  const displayAddress: string | null =
    data?.listing?.address || reverseResult?.shortAddress || null;

  const features = useMemo(
    () =>
      resolvedLocation && data?.listing && [
        {
          id: data.listing.sys.id,
          title: data.listing.title,
          location: resolvedLocation,
          images: data.listing.imagesCollection.items.filter((x: any) => x),
          price: data.listing.price,
          bedrooms: data.listing.bedrooms,
          bathrooms: data.listing.bathrooms,
          squareFootage: data.listing.squareFootage,
          address: displayAddress ?? undefined,
          availableDate: data.listing.availableDate,
        },
      ],
    [data, resolvedLocation, displayAddress]
  );

  // Redirect to listings if the listing doesn't exist or is rented
  useEffect(() => {
    if (!loading && data && (!data.listing || data.listing.rented)) {
      navigate("/listings");
    }
  }, [data, loading, navigate]);

  if (loading) return null;
  if (!data?.listing) return null;

  const price = formatCurrency({ amount: data.listing.price, language });

  const images = data.listing.imagesCollection.items.filter((x: any) => x);

  const imageLayout = getImageLayout(images.length);

  // YouTube video tour — when present, switches the gallery to a hero + 4-grid + video layout.
  const videoId = getYoutubeVideoId(data.listing.videoTourLink);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

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
      <Header setMode={setMode} alignWithContainer />

      <Button
        style={{ position: "sticky", top: 0, zIndex: 2 }}
        onClick={() => {
          // Ensure listings open in list view when returning from a single listing
          localStorage.setItem('listingsView', 'list');
          navigate("/listings");
        }}
        startIcon={<NavigateBefore sx={{ fontSize: 28 }} />}
        sx={{ fontSize: '1rem', textTransform: 'none' }}
      >
        Back to Listings
      </Button>

      {videoId && images.length >= 1 ? (
        // Video-tour layout: full-width hero, then a 50/50 split with 4 images
        // (2x2 grid) on the left and a clickable YouTube thumbnail on the right.
        <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", gap: 1 }}>
          <Box
            onClick={() => setStartIndex(0)}
            sx={{
              width: "100%",
              height: 400,
              overflow: "hidden",
              borderRadius: "12px",
              cursor: "pointer",
              "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
            }}
          >
            <img src={images[0].url} alt={images[0].title} loading="lazy" />
          </Box>

          <Box sx={{ display: "flex", gap: 1, height: 320 }}>
            <Box
              sx={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: 1,
              }}
            >
              {images.slice(1, 5).map((item: any, i: number) => (
                <Box
                  key={item.sys.id}
                  onClick={() => setStartIndex(i + 1)}
                  sx={{
                    overflow: "hidden",
                    borderRadius: "12px",
                    cursor: "pointer",
                    "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
                  }}
                >
                  <img src={item.url} alt={item.title} loading="lazy" />
                </Box>
              ))}
            </Box>

            <Box
              onClick={() => setVideoOpen(true)}
              sx={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: "#000",
                "&:hover .play-icon": { transform: "translate(-50%, -50%) scale(1.1)" },
              }}
            >
              {videoThumbnail && (
                <img
                  src={videoThumbnail}
                  alt="Video tour"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.85 }}
                />
              )}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(0, 0, 0, 0.65)",
                  color: "#fff",
                  pl: 0.75,
                  pr: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  border: "1.5px solid",
                  borderColor: "primary.main",
                  pointerEvents: "none",
                }}
              >
                <PlayArrow sx={{ fontSize: 18, color: "primary.main" }} />
                Virtual Visit
              </Box>
              <Box
                className="play-icon"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  border: "2px solid",
                  borderColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.18s ease",
                  pointerEvents: "none",
                }}
              >
                <PlayArrow sx={{ fontSize: 56, color: "#fff", ml: 0.5 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
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
      )}

      <MobileImageCarousel>
        <StyledImageCarousel images={images} aspectRatio={1.8} showPreviews />
      </MobileImageCarousel>

      {/* Mobile-only video thumbnail — sits between the image carousel and the spotlight */}
      {videoId && (
        <Box
          onClick={() => setVideoOpen(true)}
          sx={{
            display: { xs: "block", sm: "none" },
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9
            mt: 1,
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: "#000",
          }}
        >
          {videoThumbnail && (
            <img
              src={videoThumbnail}
              alt="Video tour"
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
              }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "2px solid",
              borderColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <PlayArrow sx={{ fontSize: 44, color: "#fff", ml: 0.5 }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(0, 0, 0, 0.65)",
              color: "#fff",
              pl: 0.75,
              pr: 1.25,
              py: 0.5,
              borderRadius: 999,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: 0.3,
              border: "1.5px solid",
              borderColor: "primary.main",
              pointerEvents: "none",
            }}
          >
            <PlayArrow sx={{ fontSize: 18, color: "primary.main" }} />
            Virtual Visit
          </Box>
        </Box>
      )}

      <Modal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Container maxWidth="lg" sx={{ outline: "none" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%", // 16:9 aspect ratio
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#000",
            }}
          >
            {videoId && videoOpen && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Video tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            )}
          </Box>
        </Container>
      </Modal>

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
            popup
            startIndex={startIndex || 0}
          />
        </Container>
      </ImageCarouselModal>

      <TitleWithMap>
        <TitleContainer>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              padding: "12px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              height: "100%",
              justifyContent: "center",
            }}
          >
            <TitleText>{data.listing.title}</TitleText>
            <Divider sx={{ my: 0.25 }} />
            <Box
              sx={{
                display: "grid",
                // Fixed-width icon column so the gap (and text's left edge) stays
                // identical across rows regardless of each icon's visual weight.
                gridTemplateColumns: "24px auto",
                columnGap: 1,
                rowGap: 0.45,
                alignItems: "center",
                // Shrink grid to its content and center it in the card so
                // icons form a column and text starts at the same X (like a tab stop).
                width: "fit-content",
                margin: "0 auto",
                // Parent TitleContainer sets textAlign:center; override so the
                // text column left-aligns and every row starts at the same X.
                textAlign: "left",
                // Center each icon within its 24px cell so small visual differences
                // between icons don't shift the perceived gap.
                // :nth-child (position-based) correctly targets every icon;
                // :nth-of-type would break because the grid mixes <svg>, <a>, <p>.
                "& > :nth-child(odd)": {
                  justifySelf: "center",
                },
                // Pin text cells to the start of column 2 and force left alignment
                // (overrides text-align:center inherited from TitleContainer).
                "& > :nth-child(even)": {
                  justifySelf: "start",
                  textAlign: "left",
                },
              }}
            >
              {resolvedLocation && (
                <>
                  <LocationOnOutlined fontSize="small" />
                  <StyledLink
                    target="_blank"
                    href={`https://maps.google.com/?q=${resolvedLocation.lat},${resolvedLocation.lon}`}
                  >
                    <Typography variant="body2" sx={{ fontSize: "17px" }}>View on map</Typography>
                  </StyledLink>
                </>
              )}
              {!!data.listing.bedrooms && (
                <>
                  <BedOutlined fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: "17px" }}>
                    {data.listing.bedrooms}{" "}
                    {data.listing.bedrooms > 1 ? t("common.bedrooms") : t("common.bedroom")}
                  </Typography>
                </>
              )}
              {!!data.listing.bathrooms && (
                <>
                  <ShowerOutlined fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: "17px" }}>
                    {data.listing.bathrooms}{" "}
                    {data.listing.bathrooms > 1 ? t("common.bathrooms") : t("common.bathroom")}
                  </Typography>
                </>
              )}
              {data.listing.squareFootage && (
                <>
                  <SpaceDashboardOutlined fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: "17px" }}>
                    {data.listing.squareFootage} {t("common.sqft")}
                  </Typography>
                </>
              )}
              {data.listing.price && (
                <>
                  <LocalAtm fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: "17px" }}>
                    {price} / {t("common.month")}
                  </Typography>
                </>
              )}
              {formattedDate && (
                <>
                  <EventAvailableOutlined fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: "17px" }}>{formattedDate}</Typography>
                </>
              )}
            </Box>
          </Paper>
        </TitleContainer>
        <MapContainer>
          <Map features={features} allowMarkerPopups={false} />
        </MapContainer>
      </TitleWithMap>

      <BodyContainer>
        <DescriptionWrapper>
          {data.listing.description && (
            <DescriptionContainer style={{ maxWidth: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{t("common.description")}</Typography>
              <Typography
                variant="body1"
                style={{ whiteSpace: "preserve-breaks" }}
              >
                {data.listing.description}
              </Typography>
            </DescriptionContainer>
          )}
        </DescriptionWrapper>

        {data.listing.amenities && (() => {
          const amenities = consolidateAmenities(data.listing.amenities as string[]) as Amenity[];
          // Pets takes precedence so a pet-keyword amenity never double-displays.
          const pets = amenities.filter(a => isPetAmenity(a));
          const inclusions = amenities
            .filter(a => isInclusionAmenity(a) && !isPetAmenity(a))
            .sort((a, b) => getInclusionPriority(a) - getInclusionPriority(b));
          const features = amenities
            .filter(a => !isInclusionAmenity(a) && !isPetAmenity(a))
            .sort((a, b) => getFeaturePriority(a) - getFeaturePriority(b));

          const renderSection = (label: string, items: Amenity[]) =>
            items.length > 0 && (
              <div>
                <Typography variant="h6" sx={{ mt: 1.5, mb: 0.5 }}>{label}</Typography>
                <Divider sx={{ mb: 1 }} />
                <AmenitiesList>
                  {items.map(amenity => (
                    <Typography key={amenity}>- {getAmenityLabel(amenity)}</Typography>
                  ))}
                </AmenitiesList>
              </div>
            );

          return (
            <AmenitiesContainer>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{t("common.details")}</Typography>
              {renderSection("Inclusions / Exclusions", inclusions)}
              {renderSection("Pet Policy", pets)}
              {renderSection("Additional Features", features)}
            </AmenitiesContainer>
          );
        })()}
      </BodyContainer>

      <ContactContainer style={{ padding: "0 10px 60px", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disableElevation
          onClick={() => navigate(`/listings/${id}/book`)}
          sx={{ height: 48, padding: "10px 24px", fontSize: "1rem", textTransform: "uppercase", boxSizing: "border-box", border: "1px solid transparent" }}
        >
          {"BOOK A VISIT"}
        </Button>

        <Button
          variant="contained"
          size="large"
          disableElevation
          href={EXTERNAL_URLS.GOOGLE_FORM}
          target="_blank"
          sx={{ textTransform: "uppercase", height: 48, padding: "10px 24px", fontSize: "1rem", boxSizing: "border-box", border: "1px solid transparent" }}
        >
          {String(t("common.apply")).toUpperCase()}
        </Button>

        <Button
          startIcon={<Help />}
          variant="outlined"
          size="large"
          href={EXTERNAL_URLS.EMAIL}
          sx={{ height: 48, padding: "10px 24px", fontSize: "1rem", boxSizing: "border-box" }}
        >
          {EXTERNAL_URLS.EMAIL_ADDRESS}
        </Button>
      </ContactContainer>
    </ListingContainer>
  );
};

export default Listing;
