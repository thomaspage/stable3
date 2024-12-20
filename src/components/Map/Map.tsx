import { ReactElement, useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, MapboxGeoJSONFeature, Marker } from "mapbox-gl";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import Popup from "./Popup";
import { MapProps } from "./Map.types";
import ImageCarousel from "../ImageCarousel";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils";
import { useTranslation } from "react-i18next";
import { Link as StyledLink, Container, Paper, Typography, useTheme } from "@mui/material";

const Map = ({ features, onPopupClick }: MapProps) => {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const {
    i18n: { language },
  } = useTranslation();

  const [color, setColor] = useState<string>();

  const [popup, setPopup] = useState<{
    content: ReactElement | null;
    lngLat: LngLat | null;
  } | null>(null);

  const theme = useTheme();

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      //   style: "mapbox://styles/mapbox/streets-v12",
      //   center: [lng, lat],
      //   zoom: zoom,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-75, 45],
      zoom: 5,
    });
  }, []);

  // Change style of map
  useEffect(() => {
    if (!map.current) return;

    map.current.setStyle(`mapbox://styles/mapbox/${theme.palette.mode}-v11`);
  }, [theme.palette.mode]);

  useEffect(() => {
    if (!map.current) return;

    const markers: Marker[] = [];
    const elements: HTMLElement[] = [];

    const bounds = new mapboxgl.LngLatBounds();

    setPopup(null);

    if (!features) return;

    // add markers to map
    for (const feature of features) {
      if (!feature.location) continue;

      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = formatCurrency({ amount: feature.price, language });

      elements.push(el);

      const coordinates = new LngLat(
        feature.location.lon,
        feature.location.lat
      );

      bounds.extend(feature.location);

      el.addEventListener("click", function (e) {
        // Prevent the `map.on('click')` from being triggered
        e.stopPropagation();

        // Bring marker to the front
        elements.forEach((element) => {
          element.classList.remove("active");
        });
        el.classList.add("active");

        setPopup({
          content: (
            <Paper elevation={2} style={{ padding: 10 }}>
              {feature?.images && <ImageCarousel images={feature.images} />}
              <h1>{feature.title}</h1>
              <p>{feature.description}</p>
              <Link to={`/listings/${feature.id}`}>
                <StyledLink>
                  <Typography textAlign="right" variant="body2">Go to listing →</Typography>
                </StyledLink>
              </Link>
            </Paper>
          ),
          lngLat: coordinates,
        });

        onPopupClick?.(feature);
      });

      if (!bounds.isEmpty()) {
        try {
          map.current.fitBounds(bounds, {
            padding: 100,
          });
        } catch {
          map.current.fitBounds(bounds, {
            padding: 20,
          });
        }
      }

      // make a marker for each feature and add to the map
      const marker = new mapboxgl.Marker(el).setLngLat(feature.location);

      marker.addTo(map.current);
      markers.push(marker);
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [features]);

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
