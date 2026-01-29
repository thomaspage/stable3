import mapboxgl, { LngLatLike } from "mapbox-gl";
import { ReactNode } from "react";

/**
 * Props for the Map Popup component
 */
export interface PopupProps {
  /** Coordinates where the popup should be anchored */
  lngLat: LngLatLike;
  /** Content to display in the popup */
  children: ReactNode;
  /** Reference to the Mapbox map instance */
  map: mapboxgl.Map;
}