import {
  Button,
  Slider,
} from "@mui/material";
import {
  ButtonsContainer,
  Capitalized,
  FiltersContainer,
} from "./Filters.style";
import { FiltersProps } from "./Fitlers.types";
import { formatCurrency } from "../../../utils";
import { useTranslation } from "react-i18next";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { PRICE_RANGE } from "../../../constants";

/**
 * Filters component for filtering rental listings
 * Provides UI controls for price range, bedrooms, and bathrooms
 */
const Filters = ({ filters, setFilters }: FiltersProps) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const [prices, setPrices] = useState<[number, number]>([
    PRICE_RANGE.MIN,
    PRICE_RANGE.MAX,
  ]);
  const [bedrooms, setBedrooms] = useState<Set<number>>(new Set());
  const [bathrooms, setBathrooms] = useState<Set<number>>(new Set());
  const [amenities, setAmenities] = useState<Set<string>>(new Set());
  const [availableDate, setAvailableDate] = useState<string>("");
  
  // Debounce timeout to avoid excessive API calls
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const firstUpdate = useRef(true);

  /**
   * Toggle bedroom filter selection
   */
  const handleBedroomsChange = (newBedroom: number) => {
    const newBedrooms = new Set(bedrooms);
    bedrooms.has(newBedroom)
      ? newBedrooms.delete(newBedroom)
      : newBedrooms.add(newBedroom);
    setBedrooms(newBedrooms);
  };

  /**
   * Toggle bathroom filter selection
   */
  const handleBathroomsChange = (newBathroom: number) => {
    const newBathrooms = new Set(bathrooms);
    bathrooms.has(newBathroom)
      ? newBathrooms.delete(newBathroom)
      : newBathrooms.add(newBathroom);
    setBathrooms(newBathrooms);
  };

  /**
   * Toggle amenity filter selection (currently unused but kept for future use)
   */
  const handleAmenitiesChange = (newAmenity: string) => {
    const newAmenities = new Set(amenities);
    amenities.has(newAmenity)
      ? newAmenities.delete(newAmenity)
      : newAmenities.add(newAmenity);
    setAmenities(newAmenities);
  };

  /**
   * Handle price range slider change
   */
  const handlePriceChange = (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    setPrices(value as [number, number]);
  };

  /**
   * Debounce filter updates to avoid excessive API calls
   * Waits 1 second after user stops interacting before applying filters
   */
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    // Skip first render
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    
    timeout.current = setTimeout(() => {
      setFilters({
        amenitiesContainsAll: Array.from(amenities),
        bathroomsIn: bathrooms.size ? Array.from(bathrooms) : undefined,
        bedroomsIn: bedrooms.size ? Array.from(bedrooms) : undefined,
        priceMin: prices[0] === PRICE_RANGE.MIN ? undefined : prices[0],
        priceMax: prices[1] === PRICE_RANGE.MAX ? undefined : prices[1],
        availableDate: availableDate ? availableDate : undefined,
      });
    }, 1000);
  }, [bedrooms, prices, bathrooms, amenities, availableDate, setFilters]);

  return (
    <FiltersContainer>
      <Capitalized>{t("common.monthlyRent")}</Capitalized>

      <div style={{ padding: 25, paddingTop: 50 }}>
        <Slider
          getAriaValueText={(value) => `$${value}`}
          defaultValue={[PRICE_RANGE.MIN, PRICE_RANGE.MAX]}
          valueLabelDisplay="on"
          valueLabelFormat={(value) =>
            `${formatCurrency({ amount: value, language })}${
              value === PRICE_RANGE.MAX ? "+" : ""
            }`
          }
          step={PRICE_RANGE.STEP}
          onChangeCommitted={handlePriceChange}
          min={PRICE_RANGE.MIN}
          max={PRICE_RANGE.MAX}
        />
      </div>

      <Capitalized>{t("common.bedrooms")}</Capitalized>
      <ButtonsContainer>
        {[1, 2, 3, 4, 5].map((bedroom) => (
          <Button
            key={bedroom}
            variant={bedrooms.has(bedroom) ? "contained" : "outlined"}
            onClick={() => handleBedroomsChange(bedroom)}
            style={{ minWidth: "unset" }}
          >
            {bedroom}
          </Button>
        ))}
      </ButtonsContainer>

      <Capitalized>{t("common.bathrooms")}</Capitalized>
      <ButtonsContainer>
        {[1, 2, 3].map((bathroom) => (
          <Button
            key={bathroom}
            variant={bathrooms.has(bathroom) ? "contained" : "outlined"}
            onClick={() => handleBathroomsChange(bathroom)}
            style={{ minWidth: "unset" }}
          >
            {bathroom}
          </Button>
        ))}
      </ButtonsContainer>
    </FiltersContainer>
  );
}; 

export default Filters;
