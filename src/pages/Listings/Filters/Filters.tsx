import {
  Button,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import {
  ButtonsContainer,
  Capitalized,
  FiltersContainer,
} from "./Filters.style";
import { FiltersProps } from "./Fitlers.types";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { PRICE_RANGE } from "../../../constants";

const Filters = ({ setFilters, options, onClose }: FiltersProps) => {
  const { t } = useTranslation();

  // ── Price ──
  const [prices, setPrices] = useState<[number, number]>([
    PRICE_RANGE.MIN,
    PRICE_RANGE.MAX,
  ]);
  const [priceMinInput, setPriceMinInput] = useState(String(PRICE_RANGE.MIN));
  const [priceMaxInput, setPriceMaxInput] = useState(String(PRICE_RANGE.MAX));

  // ── Square footage ──
  const [sqft, setSqft] = useState<[number, number]>([
    options.sqftMin,
    options.sqftMax,
  ]);
  const [sqftMinInput, setSqftMinInput] = useState(String(options.sqftMin));
  const [sqftMaxInput, setSqftMaxInput] = useState(String(options.sqftMax));

  // Sync sqft range when real options arrive (useState only captured the
  // initial 0/5000 defaults on first render).
  useEffect(() => {
    if (options.sqftMin === 0 && options.sqftMax === 5000) return;
    setSqft([options.sqftMin, options.sqftMax]);
    setSqftMinInput(String(options.sqftMin));
    setSqftMaxInput(String(options.sqftMax));
  }, [options.sqftMin, options.sqftMax]);

  // ── Toggle filters ──
  const [bedrooms, setBedrooms] = useState<Set<number>>(new Set());
  const [bathrooms, setBathrooms] = useState<Set<number>>(new Set());
  const [cities, setCities] = useState<Set<string>>(new Set());
  const [availableDate, setAvailableDate] = useState<string>("");

  const timeout = useRef<NodeJS.Timeout | null>(null);
  const firstUpdate = useRef(true);

  const toggleSet = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  // ── Debounced filter sync ──
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    timeout.current = setTimeout(() => {
      setFilters({
        bathroomsIn: bathrooms.size ? Array.from(bathrooms) : undefined,
        bedroomsIn: bedrooms.size ? Array.from(bedrooms) : undefined,
        cityIn: cities.size ? Array.from(cities) : undefined,
        priceMin: prices[0] === PRICE_RANGE.MIN ? undefined : prices[0],
        priceMax: prices[1] === PRICE_RANGE.MAX ? undefined : prices[1],
        sqftMin: sqft[0] === options.sqftMin ? undefined : sqft[0],
        sqftMax: sqft[1] === options.sqftMax ? undefined : sqft[1],
        availableDate: availableDate || undefined,
      });
    }, 1000);
  }, [bedrooms, prices, sqft, bathrooms, cities, availableDate, setFilters, options.sqftMin, options.sqftMax]);

  const resetToDefault = () => {
    setPrices([PRICE_RANGE.MIN, PRICE_RANGE.MAX]);
    setPriceMinInput(String(PRICE_RANGE.MIN));
    setPriceMaxInput(String(PRICE_RANGE.MAX));
    setSqft([options.sqftMin, options.sqftMax]);
    setSqftMinInput(String(options.sqftMin));
    setSqftMaxInput(String(options.sqftMax));
    setBedrooms(new Set());
    setBathrooms(new Set());
    setCities(new Set());
    setAvailableDate("");
    setFilters({});
  };

  // ── Input-box commit (on blur) ──
  const commitPriceInputs = () => {
    let min = parseInt(priceMinInput) || PRICE_RANGE.MIN;
    let max = parseInt(priceMaxInput) || PRICE_RANGE.MAX;
    min = Math.max(PRICE_RANGE.MIN, Math.min(min, PRICE_RANGE.MAX));
    max = Math.max(PRICE_RANGE.MIN, Math.min(max, PRICE_RANGE.MAX));
    if (min > max) [min, max] = [max, min];
    setPrices([min, max]);
    setPriceMinInput(String(min));
    setPriceMaxInput(String(max));
  };

  const commitSqftInputs = () => {
    let min = parseInt(sqftMinInput) || options.sqftMin;
    let max = parseInt(sqftMaxInput) || options.sqftMax;
    min = Math.max(options.sqftMin, Math.min(min, options.sqftMax));
    max = Math.max(options.sqftMin, Math.min(max, options.sqftMax));
    if (min > max) [min, max] = [max, min];
    setSqft([min, max]);
    setSqftMinInput(String(min));
    setSqftMaxInput(String(max));
  };

  // Toggle button styles: unselected uses regular text color (not orange),
  // selected keeps the contained primary fill.
  const toggleSx = {
    minWidth: "unset",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "text.primary",
    borderColor: "divider",
  };
  const toggleSelectedSx = {
    minWidth: "unset",
    fontWeight: 600,
    fontSize: "0.95rem",
  };

  const rangeBoxSx = (active: boolean) => ({
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      ...(active && {
        backgroundColor: "primary.main",
        "& fieldset": { borderColor: "primary.main" },
        "&:hover fieldset": { borderColor: "primary.dark" },
      }),
    },
    "& .MuiOutlinedInput-input": {
      textAlign: "center",
      padding: "10px 8px",
      fontWeight: 600,
      fontSize: "0.95rem",
      ...(active && { color: "#fff" }),
    },
    ...(active && {
      "& .MuiTypography-root": { color: "rgba(255,255,255,0.85)" },
    }),
  });

  return (
    <FiltersContainer>

      {/* ── PRICE ── */}
      <Capitalized>{t("common.monthlyRent")}</Capitalized>
      <div style={{ padding: "16px 12px 4px" }}>
        <Slider
          value={prices}
          valueLabelDisplay="off"
          step={10}
          onChange={(_e, v) => {
            const [min, max] = v as [number, number];
            setPrices([min, max]);
            setPriceMinInput(String(min));
            setPriceMaxInput(String(max));
          }}
          min={PRICE_RANGE.MIN}
          max={PRICE_RANGE.MAX}
        />
      </div>
      <div style={{ display: "flex", gap: 10, paddingBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>Min</Typography>
          <TextField
            size="small"
            value={priceMinInput}
            onChange={(e) => setPriceMinInput(e.target.value)}
            onBlur={commitPriceInputs}
            InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">$/month</Typography> }}
            sx={rangeBoxSx(prices[0] !== PRICE_RANGE.MIN)}
            fullWidth
          />
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>Max</Typography>
          <TextField
            size="small"
            value={priceMaxInput}
            onChange={(e) => setPriceMaxInput(e.target.value)}
            onBlur={commitPriceInputs}
            InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">$/month</Typography> }}
            sx={rangeBoxSx(prices[1] !== PRICE_RANGE.MAX)}
            fullWidth
          />
        </div>
      </div>

      {/* ── SQUARE FOOTAGE ── */}
      {options.sqftMax > options.sqftMin && (
        <>
          <Capitalized>Size (Square Feet)</Capitalized>
          <div style={{ padding: "16px 12px 4px" }}>
            <Slider
              value={sqft}
              valueLabelDisplay="off"
              step={10}
              onChange={(_e, v) => {
                const [min, max] = v as [number, number];
                setSqft([min, max]);
                setSqftMinInput(String(min));
                setSqftMaxInput(String(max));
              }}
              min={options.sqftMin}
              max={options.sqftMax}
            />
          </div>
          <div style={{ display: "flex", gap: 10, paddingBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>Min</Typography>
              <TextField
                size="small"
                value={sqftMinInput}
                onChange={(e) => setSqftMinInput(e.target.value)}
                onBlur={commitSqftInputs}
                InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">{t("common.sqft")}</Typography> }}
                sx={rangeBoxSx(sqft[0] !== options.sqftMin)}
                fullWidth
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>Max</Typography>
              <TextField
                size="small"
                value={sqftMaxInput}
                onChange={(e) => setSqftMaxInput(e.target.value)}
                onBlur={commitSqftInputs}
                InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">{t("common.sqft")}</Typography> }}
                sx={rangeBoxSx(sqft[1] !== options.sqftMax)}
                fullWidth
              />
            </div>
          </div>
        </>
      )}

      {/* ── CITY / REGION ── */}
      {options.cities.length > 1 && (
        <>
          <Capitalized>City / Region</Capitalized>
          <ButtonsContainer>
            {options.cities.map((city) => (
              <Button
                key={city}
                variant={cities.has(city) ? "contained" : "outlined"}
                onClick={() => setCities(toggleSet(cities, city))}
                sx={cities.has(city) ? toggleSelectedSx : toggleSx}
              >
                {city}
              </Button>
            ))}
          </ButtonsContainer>
        </>
      )}

      {/* ── BEDROOMS ── */}
      {options.bedrooms.length > 0 && (
        <>
          <Capitalized>{t("common.bedrooms")}</Capitalized>
          <ButtonsContainer>
            {options.bedrooms.map((bedroom) => (
              <Button
                key={bedroom}
                variant={bedrooms.has(bedroom) ? "contained" : "outlined"}
                onClick={() => setBedrooms(toggleSet(bedrooms, bedroom))}
                sx={bedrooms.has(bedroom) ? toggleSelectedSx : toggleSx}
              >
                {bedroom}
              </Button>
            ))}
          </ButtonsContainer>
        </>
      )}

      {/* ── BATHROOMS ── */}
      {options.bathrooms.length > 0 && (
        <>
          <Capitalized>{t("common.bathrooms")}</Capitalized>
          <ButtonsContainer>
            {options.bathrooms.map((bathroom) => (
              <Button
                key={bathroom}
                variant={bathrooms.has(bathroom) ? "contained" : "outlined"}
                onClick={() => setBathrooms(toggleSet(bathrooms, bathroom))}
                sx={bathrooms.has(bathroom) ? toggleSelectedSx : toggleSx}
              >
                {bathroom}
              </Button>
            ))}
          </ButtonsContainer>
        </>
      )}

      {/* ── SEARCH + RESET ── */}
      <div style={{ padding: 12, paddingTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
        {onClose && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableElevation
            fullWidth
            onClick={onClose}
            sx={{ height: 48, fontSize: "1rem", padding: "10px 24px", boxSizing: "border-box", border: "1px solid transparent" }}
          >
            Search
          </Button>
        )}
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={resetToDefault}
          sx={{ height: 48, fontSize: "1rem", padding: "10px 24px", boxSizing: "border-box" }}
        >
          Reset Filters
        </Button>
      </div>
    </FiltersContainer>
  );
};

export default Filters;
