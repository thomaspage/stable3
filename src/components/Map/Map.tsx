import { ReactElement, useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import Popup from "./Popup";
import { MapProps } from "./Map.types";
import ImageCarousel from "../ImageCarousel";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils";
import { useTranslation } from "react-i18next";
import { Link as StyledLink, Paper, Typography, useTheme, Box, Button } from "@mui/material";
import ArrowForward from '@mui/icons-material/ArrowForward';
import BedOutlined from '@mui/icons-material/BedOutlined';
import ShowerOutlined from '@mui/icons-material/ShowerOutlined';
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined';
import LocalAtm from '@mui/icons-material/LocalAtm';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, SINGLE_LISTING_ZOOM } from "../../constants";

const Map = ({ features, onPopupClick, allowMarkerPopups = true }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const [popup, setPopup] = useState<{
    id: string | null;
    content: ReactElement | null;
    lngLat: LngLat | null;
  } | null>(null);

  const theme = useTheme();

  const popupRef = useRef(popup);
  useEffect(() => {
    popupRef.current = popup;
  }, [popup]);

  // Initialize map once on component mount
  useEffect(() => {
    if (map.current) return; // Prevent reinitializing

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    // Close popup when clicking on the map (outside a marker)
    const handleMapClick = () => {
      popupRef.current = null;
      setPopup(null);
      // Remove any active marker highlight
      const els = document.querySelectorAll('.marker.active');
      els.forEach((e) => e.classList.remove('active'));
    };
    map.current.on('click', handleMapClick);

    // Cleanup listener on unmount
    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, []);

  // Update map style when theme changes (light/dark mode)
  useEffect(() => {
    if (!map.current) return;

    map.current.setStyle(`mapbox://styles/mapbox/${theme.palette.mode}-v11`);
  }, [theme.palette.mode]);

  // Update markers when features change
  useEffect(() => {
    if (!map.current) return;

    const markers: Marker[] = [];
    const elements: HTMLElement[] = [];
    const bounds = new mapboxgl.LngLatBounds();

    setPopup(null);

    if (!features) return;

    // Create and add markers for each listing
    for (const feature of features) {
      if (!feature.location) continue;

      // Create custom HTML marker element with price
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = feature.price ? formatCurrency({ amount: feature.price, language }) : "";

      elements.push(el);

      const coordinates = new LngLat(
        feature.location.lon,
        feature.location.lat
      );

      bounds.extend(feature.location);

      // Handle marker click to show popup (toggle on re-click)
      el.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent map click event

        // If popups are disabled for this map (single-listing page), do nothing
        if (!allowMarkerPopups) return;

        // If clicking the same marker again, close the popup
        if (popupRef.current?.id === feature.id) {
          elements.forEach((element) => element.classList.remove("active"));
          popupRef.current = null;
          setPopup(null);
          onPopupClick?.(feature);
          return;
        }

        // Highlight clicked marker
        elements.forEach((element) => {
          element.classList.remove("active");
        });
        el.classList.add("active");

        // Show popup with listing details (larger image, top-left badge, and labeled circled button)
        // Compute formatted availability text (match listing page formatting & localization)
        let formattedAvailable: string | null = null;
        if (feature.availableDate) {
          const d = new Date(feature.availableDate);
          const today = new Date();
          const utcDate = new Date(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate()
          );
          formattedAvailable =
            d < today
              ? t("common.availableNow")
              : t("common.availableDate", {
                  date: formatDate({ date: utcDate, language }),
                });
        }

        setPopup({
          id: feature.id,
          content: (
            <Paper elevation={2} style={{ padding: 12, maxWidth: 560 }}>
              <Box sx={{ position: 'relative' }}>
                {/* top-left badge with price and availability */}
                {(formattedAvailable || feature.price) && (
                  <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.95)', px: 1, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
                    {feature.price && (
                      <Typography variant='caption' sx={{ display: 'block', fontWeight: 700 }}>
                        {formatCurrency({ amount: feature.price, language })}
                      </Typography>
                    )}
                    {formattedAvailable && (
                      <Typography variant='caption' sx={{ display: 'block', color: theme.palette.warning.main, fontWeight: 700 }}>
                        {formattedAvailable}
                      </Typography>
                    )}
                  </Box>
                )}

                {feature?.images && (
                  <ImageCarousel
                    images={feature.images}
                    popup
                    showPreviews={false}
                    aspectRatio={1.6}
                    style={{ maxHeight: 340, overflow: 'hidden' }}
                  />
                )}
              </Box>

              <Typography variant="h6" sx={{ mt: 1, mb: 0.5, textAlign: 'center', fontWeight: 700 }}>
                {feature.title}
              </Typography>

              {feature.description && (
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                  {feature.description}
                </Typography>
              )}

              {/* Highlights (optional) */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                {feature.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnOutlined sx={{ fontSize: 18 }} />
                    <Typography variant='caption'>{feature.address}</Typography>
                  </Box>
                )}
                {feature.bedrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BedOutlined sx={{ fontSize: 18 }} />
                    <Typography variant='caption'>{feature.bedrooms}</Typography>
                  </Box>
                )}
                {feature.bathrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ShowerOutlined sx={{ fontSize: 18 }} />
                    <Typography variant='caption'>{feature.bathrooms}</Typography>
                  </Box>
                )}
                {feature.squareFootage && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SpaceDashboardOutlined sx={{ fontSize: 18 }} />
                    <Typography variant='caption'>{feature.squareFootage} sqft</Typography>
                  </Box>
                )}
              </Box>

              {/* Labeled circled button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Link to={`/listings/${feature.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant='outlined' size='small' sx={{ borderRadius: '999px', px: 2, py: 0.5 }}>
                    <Typography variant='button' sx={{ fontSize: 12, mr: 1 }}>Listing Details</Typography>
                    <ArrowForward />
                  </Button>
                </Link>
              </Box>
            </Paper>
          ),
          lngLat: coordinates,
        });

        onPopupClick?.(feature);
      });

      // Adjust map view to fit all markers
      if (!bounds.isEmpty()) {
        if (features.length === 1) {
          // Single marker: center and zoom in
          map.current.setCenter(bounds.getCenter());
          map.current.setZoom(SINGLE_LISTING_ZOOM);
        } else {
          // Multiple markers: fit bounds with padding
          try {
            map.current.fitBounds(bounds, {
              padding: 100,
            });
          } catch {
            // Fallback with smaller padding if it fails
            map.current.fitBounds(bounds, {
              padding: 20,
            });
          }
        }
      }

      // Create and add marker to map
      const marker = new mapboxgl.Marker(el).setLngLat(feature.location);
      marker.addTo(map.current);
      markers.push(marker);
    }

    // Cleanup: remove markers when component unmounts or features change
    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [features, language, onPopupClick]);

  return (
    <div style={{ height: "100%" }}>
      {popup?.lngLat && map.current && (
        <Popup lngLat={popup.lngLat} map={map.current}>
          {popup.content}
        </Popup>
      )}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Map;
