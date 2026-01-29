import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { PopupProps } from "./Popup.types";
import { Paper } from "@mui/material";

/**
 * Popup component for displaying content on the Mapbox map
 * Creates a Mapbox popup anchored to specific coordinates
 */
export const Popup = ({ children, lngLat, map }: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popupRef.current) return;

    // Create and configure Mapbox popup
    const popup = new mapboxgl.Popup({})
      .setLngLat(lngLat)
      .setOffset([0, -15]) // Offset popup above marker
      .setDOMContent(popupRef.current)
      .addTo(map);

    // Cleanup: remove popup when component unmounts or dependencies change
    return () => {
      popup.remove();
    };
  }, [children, lngLat, map]);

  return (
    <div style={{ display: "none" }}>
      <Paper ref={popupRef}>{children}</Paper>
    </div>
  );
};

export default Popup;
