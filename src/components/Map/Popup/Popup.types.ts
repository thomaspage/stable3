import mapboxgl, { LngLatLike } from "mapbox-gl";
import { ReactNode } from "react";

export interface PopupProps {
  lngLat: LngLatLike;
  // onClose: () => void;
  children: ReactNode;
  map: mapboxgl.Map;
}