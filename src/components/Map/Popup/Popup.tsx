import React, { EffectCallback, useContext, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { PopupProps } from "./Popup.types";
import { Paper } from "@mui/material";
// import { mapContext } from "../Map.context";

export const Popup = ({ children, lngLat, map }: PopupProps) => {

  const popupRef = useRef<any>(null);

  useEffect(() => {

    const popup = new mapboxgl.Popup({})
      .setLngLat(lngLat)
      .setOffset([0, -15])
      .setDOMContent(popupRef.current)
      .addTo(map);

    return popup.remove as () => void;
  }, [children, lngLat]);

  return (
    <div style={{ display: "none" }}>
      <Paper ref={popupRef}>{children}</Paper>
    </div>
  );
};

export default Popup;
