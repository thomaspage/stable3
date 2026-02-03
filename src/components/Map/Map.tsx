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
import { Paper, Typography, useTheme, Box, Button } from "@mui/material";
import ArrowForward from '@mui/icons-material/ArrowForward';
import BedOutlined from '@mui/icons-material/BedOutlined';
import ShowerOutlined from '@mui/icons-material/ShowerOutlined';
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined';

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
  const lastMarkerClickRef = useRef<number | null>(null);

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
    const handleMapClick = (e: any) => {
      // If the click originated from inside a marker element, ignore it so marker clicks can open popups
      const target = e?.originalEvent?.target as HTMLElement | undefined;
      if (target && target.closest && target.closest('.marker')) return;

      // If we recently clicked a marker (within 600ms) ignore this map click to avoid immediate close
      const last = lastMarkerClickRef.current;
      if (last && Date.now() - last < 600) return;

      popupRef.current = null;
      setPopup(null);
      // Remove any active marker highlight
      const els = document.querySelectorAll('.marker.active');
      els.forEach((el) => el.classList.remove('active'));
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

      // Mark pointerdown early so map click handler can ignore the following click
      const onPointerDown = () => {
        lastMarkerClickRef.current = Date.now();
      };
      el.onpointerdown = onPointerDown;

      // Handle marker click to show popup (toggle on re-click)
      const onClick = function (e: MouseEvent) {
        (e as any).stopPropagation?.(); // Prevent map click event

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

        // ... rest of click handler follows (no changes)

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

        const popupObj = {
          id: feature.id,
          content: (
            <Paper elevation={2} sx={{ p: 1.5, maxWidth: { xs: 280, sm: 280, md: 420 }, borderRadius: '12px' }}>
              <Box sx={{ position: 'relative' }}>
                {/* top-left badge with availability */}
                {formattedAvailable && (
                  <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2, bgcolor: 'background.paper', opacity: 0.75, px: 1, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant='caption' sx={{ display: 'block', color: 'warning.main', fontWeight: 700, fontSize: '0.94rem' }}>
                      {formattedAvailable}
                    </Typography>
                  </Box>
                )}

                {/* top-right badge with price (same styling as availability) */}
                {feature.price && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, bgcolor: 'background.paper', opacity: 0.75, px: 1, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant='caption' sx={{ display: 'block', color: 'warning.main', fontWeight: 700, fontSize: '0.94rem' }}>
                      {formatCurrency({ amount: feature.price, language })}
                    </Typography>
                  </Box>
                )}

                {feature?.images && (
                  <Box className="popup-carousel" sx={{ overflow: 'hidden', borderRadius: 1 }}>
                    <ImageCarousel
                      images={feature.images}
                      popup
                      showPreviews={false}
                      aspectRatio={1.6}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.56rem', textAlign: 'center' }}>
                  {feature.title}
                </Typography>
                {feature.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, textAlign: 'center', fontSize: '0.94rem' }}>
                    {feature.description}
                  </Typography>
                )}
              </Box>

              {/* Highlights (optional) */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                {feature.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <LocationOnOutlined sx={{ fontSize: 22 }} />
                    <Typography variant='caption' sx={{ fontSize: '0.94rem' }}>{feature.address}</Typography>
                  </Box>
                )}
                {feature.bedrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <BedOutlined sx={{ fontSize: 22 }} />
                    <Typography variant='caption' sx={{ fontSize: '0.94rem' }}>{feature.bedrooms}</Typography>
                  </Box>
                )}
                {feature.bathrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <ShowerOutlined sx={{ fontSize: 22 }} />
                    <Typography variant='caption' sx={{ fontSize: '0.94rem' }}>{feature.bathrooms}</Typography>
                  </Box>
                )}
                {feature.squareFootage && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <SpaceDashboardOutlined sx={{ fontSize: 22 }} />
                    <Typography variant='caption' sx={{ fontSize: '0.94rem' }}>{feature.squareFootage} sqft</Typography>
                  </Box>
                )}
              </Box>

              {/* Labeled circled button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link to={`/listings/${feature.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant='outlined' size='small' sx={{ borderRadius: '999px', px: 2, py: 0.5 }}>
                    <Typography variant='button' sx={{ fontSize: 14, mr: 1 }}>Listing Details</Typography>
                    <ArrowForward sx={{ fontSize: 20 }} />
                  </Button>
                </Link>
              </Box>
            </Paper>
          ),
          lngLat: coordinates,
        };

        // mark the time of this marker click to prevent immediate map click from closing it
        lastMarkerClickRef.current = Date.now();
        popupRef.current = popupObj;
        setPopup(popupObj);

        onPopupClick?.(feature);
      };

      // Attach handlers
      el.onclick = onClick;

      // Create and add marker to map
      const marker = new mapboxgl.Marker(el).setLngLat(feature.location);
      marker.addTo(map.current);
      markers.push(marker);
    }

    // Adjust map view to fit all markers once after creating them
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

    // Cleanup: remove markers when component unmounts or features change
    return () => {
      // Remove DOM handlers to avoid leaks
      elements.forEach((el) => {
        (el as HTMLElement).onclick = null;
        (el as HTMLElement).onpointerdown = null;
      });

      markers.forEach((marker) => marker.remove());
    };
  }, [features, language, onPopupClick, allowMarkerPopups, t]);

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
