import { ReactElement, useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import Popup from "./Popup";
import { MapProps } from "./Map.types";
import ImageCarousel from "../ImageCarousel";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils";
import { useTranslation } from "react-i18next";
import { Link as StyledLink, Paper, Typography, useTheme } from "@mui/material";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, SINGLE_LISTING_ZOOM } from "../../constants";

const Map = ({ features, onPopupClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const {
    i18n: { language },
  } = useTranslation();

  const [popup, setPopup] = useState<{
    content: ReactElement | null;
    lngLat: LngLat | null;
  } | null>(null);

  const theme = useTheme();

  // Initialize map once on component mount
  useEffect(() => {
    if (map.current) return; // Prevent reinitializing

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });
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
      el.innerHTML = formatCurrency({ amount: feature.price, language });

      elements.push(el);

      const coordinates = new LngLat(
        feature.location.lon,
        feature.location.lat
      );

      bounds.extend(feature.location);

      // Handle marker click to show popup
      el.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent map click event

        // Highlight clicked marker
        elements.forEach((element) => {
          element.classList.remove("active");
        });
        el.classList.add("active");

        // Show popup with listing details
        setPopup({
          content: (
            <Paper elevation={2} style={{ padding: 10 }}>
              {feature?.images && <ImageCarousel images={feature.images} />}
              <h1>{feature.title}</h1>
              <p>{feature.description}</p>
              <Link to={`/listings/${feature.id}`}>
                <StyledLink>
                  <Typography textAlign="right" variant="body2">
                    Go to listing →
                  </Typography>
                </StyledLink>
              </Link>
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
