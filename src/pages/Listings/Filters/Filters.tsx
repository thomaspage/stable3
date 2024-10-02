import {
  Button,
  Input,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ImageCarousel from "../../../components/ImageCarousel";
import {
  FiltersContainer,
  SquareToggleButton,
  SquareToggleButtonGroup,
} from "./Filters.style";
import { FiltersProps } from "./Fitlers.types";
import { formatCurrency } from "../../../utils";
import { useTranslation } from "react-i18next";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Amenities } from "../../../constants";

const PRICE_MIN = 0;
const PRICE_MAX = 1500;

const Filters = ({
  // title,
  // // description,
  // price,
  // bedrooms,
  // // rating,
  // // thumbnail,
  // images,
  // squareFootage,
  // active,
  filters,
  setFilters,
}: // fullAddress
FiltersProps) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const [prices, setPrices] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [bedrooms, setBedrooms] = useState<Set<number>>(new Set());
  const [bathrooms, setBathrooms] = useState<Set<number>>(new Set());
  const [amenities, setAmenities] = useState<Set<string>>(new Set());
  const [availableDate, setAvailableDate] = useState<string>("");
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const minDistance = 50;

  const handleBedroomsChange = (newBedroom: number) => {
    const newBedrooms = new Set(bedrooms);
    bedrooms.has(newBedroom)
      ? newBedrooms.delete(newBedroom)
      : newBedrooms.add(newBedroom);
    setBedrooms(newBedrooms);
  };

  const handleBathroomsChange = (newBathroom: number) => {
    const newBathrooms = new Set(bathrooms);
    bathrooms.has(newBathroom)
      ? newBathrooms.delete(newBathroom)
      : newBathrooms.add(newBathroom);
    setBathrooms(newBathrooms);
  };

  const handleAmenitiesChange = (newAmenity: string) => {
    const newAmenities = new Set(amenities);
    amenities.has(newAmenity)
      ? newAmenities.delete(newAmenity)
      : newAmenities.add(newAmenity);
    setAmenities(newAmenities);
  };

  const handlePriceChange = (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => {
    setPrices(value as [number, number]);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setFilters({
        amenitiesContainsAll: Array.from(amenities),
        bathroomsIn: bathrooms.size ? Array.from(bathrooms) : undefined,
        bedroomsIn: bedrooms.size ? Array.from(bedrooms) : undefined,
        priceMin: prices[0] === PRICE_MIN ? undefined : prices[0],
        priceMax: prices[1] === PRICE_MAX ? undefined : prices[1],
        availableDate: availableDate ? availableDate : undefined,
      });
    }, 1000);
  }, [bedrooms, prices, bathrooms, amenities, availableDate]);

  return (
    <FiltersContainer>
      <div style={{ padding: 20 }}>
        <Slider
          getAriaValueText={(value) => `${value}°C`}
          // aria-labelledby="discrete-slider"
          defaultValue={[PRICE_MIN, PRICE_MAX]}
          valueLabelDisplay="on"
          valueLabelFormat={(value) =>
            `${formatCurrency({ amount: value, language })}${value === PRICE_MAX ? "+" : ""}`
          }
          // disableSwap={true}
          step={50}
          // marks={marks}
          // value={[priceMin, priceMax]}
          // onChange={handlePriceChange}
          onChangeCommitted={handlePriceChange}
          min={PRICE_MIN}
          max={PRICE_MAX}
          // slots={{
          //   valueLabel: ({children, open, value}) => {
          //     return <div><div
          //     style={{
          //       // fontFamily: IBM Plex Sans,
          //       // fontWeight: 600,
          //       // fontSize: 12px,
          //       position: "relative",
          //       top: "-2em",
          //       textAlign: "center",
          //       alignSelf: "center",

          //     }}>{value}</div></div>;
          //     return (
          //       <div>
          //         {open ? (
          //           <Typography variant="caption" color="textSecondary">
          //             {children}
          //           </Typography>
          //         ) : (
          //           <Typography variant="caption" color="textSecondary">
          //             {children}
          //           </Typography>
          //         )}
          //       </div>
          //     );
          //   },
          // }}
        />
        {/* <Input
          value={priceMin === PRICE_MIN ? "" : priceMin}
          type="number"
          onChange={(e) => setPriceMin(Number(e.target.value))}
          placeholder="min"
        />
        <Input
          value={priceMax === PRICE_MAX ? "" : priceMax}
          type="number"
          onChange={(e) => setPriceMax(Number(e.target.value))}
          placeholder="max"
        /> */}
      </div>

      <Typography>Bedrooms</Typography>
      <Button
        variant={bedrooms.size === 0 ? "contained" : "outlined"}
        onClick={() => setBedrooms(new Set())}
      >
        any
      </Button>
      {[0, 1, 2, 3, 4, 5].map((bedroom) => (
        <Button
          key={bedroom}
          variant={bedrooms.has(bedroom) ? "contained" : "outlined"}
          onClick={() => handleBedroomsChange(bedroom)}
        >
          {bedroom}
        </Button>
      ))}

      <Typography>Bathrooms</Typography>
      <Button
        variant={bathrooms.size === 0 ? "contained" : "outlined"}
        onClick={() => setBathrooms(new Set())}
      >
        any
      </Button>
      {[1, 2, 3].map((bathroom) => (
        <Button
          key={bathroom}
          variant={bathrooms.has(bathroom) ? "contained" : "outlined"}
          onClick={() => handleBathroomsChange(bathroom)}
        >
          {bathroom}
        </Button>
      ))}

      <Typography>Amenities</Typography>
      {Amenities.map((amenity) => (
        <Button
          key={amenity}
          variant={amenities.has(amenity) ? "contained" : "outlined"}
          onClick={() => handleAmenitiesChange(amenity)}
        >
          {t(`amenities.${amenity}`)}
        </Button>
      ))}
{/* 
      <Typography>Available Date</Typography>
      <Input
          value={availableDate}
          type="date"
          onChange={(e) => setAvailableDate(e.target.value)}
          // placeholder="min"
        /> */}

    </FiltersContainer>
  );
};

export default Filters;
