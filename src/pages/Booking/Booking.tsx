import Header from "components/Header";
import { useTranslation } from "react-i18next";
import { useState, useMemo, FormEvent } from "react";
import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Select,
  MenuItem,
  Grid,
  Box,
  Paper,
  PaletteMode,
  Divider,
  Checkbox,
  Snackbar,
  useTheme,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import {
  BedOutlined,
  ShowerOutlined,
  SpaceDashboardOutlined,
  LocalAtm,
  LocationOnOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { formatCurrency, formatDate } from "../../utils";
import { BookingContainer, FormRow } from "./Booking.styles";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "../../components/ImageCarousel";
import Map from "../../components/Map";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import { gql, useQuery } from "@apollo/client";
import { EXTERNAL_URLS } from "../../constants";
import { useGeocodedLocation, useReverseGeocodedAddress } from "../../geocode";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface LeaseHolder {
  role: "tenant" | "co-signer";
  name: string;
  linkWithApplicant: string;
  occupation: string;
  yearlyIncome: string;
}

const EMPTY_LEASE_HOLDER: LeaseHolder = {
  role: "tenant",
  name: "",
  linkWithApplicant: "",
  occupation: "",
  yearlyIncome: "",
};

const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const LISTING_QUERY = gql`
  query BookingListing($id: String!, $locale: String) {
    listing(id: $id, locale: $locale) {
      sys { id }
      title
      price
      bedrooms
      bathrooms
      squareFootage
      shortKeyDescription
      location { lat lon }
      availableDate
      imagesCollection { items { sys { id } title url } }
    }
  }
`;

// Arrow stepper for month / year (display only — not directly typeable)
const DateStepper = ({
  label,
  display,
  onDecrement,
  onIncrement,
}: {
  label: string;
  display: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton size="small" onClick={onDecrement} sx={{ p: 0.5 }}>
        <KeyboardArrowLeft fontSize="small" />
      </IconButton>
      <Typography sx={{ minWidth: 90, textAlign: "center", fontWeight: 600, fontSize: "1rem" }}>
        {display}
      </Typography>
      <IconButton size="small" onClick={onIncrement} sx={{ p: 0.5 }}>
        <KeyboardArrowRight fontSize="small" />
      </IconButton>
    </Box>
  </Box>
);


const Booking = ({ setMode }: { setMode: (mode: PaletteMode) => void }) => {
  const { t, i18n: { language } } = useTranslation();
  const { id } = useParams();
  const theme = useTheme();

  const occupantTypesList = [
    "Myself", "Spouse/Partner", "Friend", "Child",
    "Mother", "Father", "Brother", "Sister", "Cousin", "Other",
  ];

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const emailInvalid = emailTouched && !isValidEmail(email);

  const [occupantCounts, setOccupantCounts] = useState<Record<string, number>>(
    occupantTypesList.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
  );
  const [occupantOtherText, setOccupantOtherText] = useState("");

  // Date stepper — initialise to today so arrows feel immediate
  const today = new Date();
  const [dateDay, setDateDay] = useState(today.getDate());
  const [dateMonth, setDateMonth] = useState(today.getMonth() + 1); // 1-based
  const [dateYear, setDateYear] = useState(today.getFullYear());

  const maxDay = new Date(dateYear, dateMonth, 0).getDate(); // last day of current month
  const moveDate = `${dateYear}-${String(dateMonth).padStart(2, "0")}-${String(dateDay).padStart(2, "0")}`;

  const [reasonForMove, setReasonForMove] = useState("");

  // Always start with two lease-holder rows
  const [leaseHolders, setLeaseHolders] = useState<LeaseHolder[]>([
    { ...EMPTY_LEASE_HOLDER },
    { ...EMPTY_LEASE_HOLDER },
  ]);

  const [dogCount, setDogCount] = useState(0);
  const [catCount, setCatCount] = useState(0);
  const [otherAnimalCount, setOtherAnimalCount] = useState(0);
  const [otherAnimalText, setOtherAnimalText] = useState("");

  const [smokerAny, setSmokerAny] = useState(""); // "" forces the user to pick yes/no
  const [additional, setAdditional] = useState("");

  const { data: listingData } = useQuery(LISTING_QUERY, {
    variables: { id, locale: language },
    skip: !id,
    errorPolicy: "all",
  });
  const navigate = useNavigate();

  const images = listingData?.listing?.imagesCollection?.items?.filter(Boolean) ?? [];

  // Falls back to geocoding `address` when Contentful's `location` is empty.
  const resolvedLocation = useGeocodedLocation(
    listingData?.listing?.location,
    listingData?.listing?.address,
  );

  // Reverse-geocodes the pin when no explicit text `address` was set,
  // so editors can fill just the Location field and the UI still shows a title.
  const reverseResult = useReverseGeocodedAddress(resolvedLocation);
  const displayAddress: string | null =
    listingData?.listing?.address || reverseResult?.shortAddress || null;

  const features = useMemo(
    () =>
      resolvedLocation && listingData?.listing
        ? [
            {
              id: listingData.listing.sys.id,
              title: listingData.listing.title,
              location: resolvedLocation,
              images,
              price: listingData.listing.price,
              bedrooms: listingData.listing.bedrooms,
              bathrooms: listingData.listing.bathrooms,
              squareFootage: listingData.listing.squareFootage,
              address: displayAddress ?? undefined,
              availableDate: listingData.listing.availableDate,
            },
          ]
        : undefined,
    [listingData, resolvedLocation, displayAddress] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // GPS coordinates for precise Google Maps link (includes postal code context)
  const googleMapsUrl = resolvedLocation
    ? `https://maps.google.com/?q=${resolvedLocation.lat},${resolvedLocation.lon}`
    : displayAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(displayAddress)}`
    : null;

  // Availability badge — same logic as Tile component
  const availabilityBadge = (() => {
    if (!listingData?.listing?.availableDate) return null;
    const date = new Date(listingData.listing.availableDate);
    if (date < today) return t("common.availableNow");
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return formatDate({ date: utcDate, language });
  })();

  const updateLeaseHolder = (index: number, field: keyof LeaseHolder, value: string) => {
    setLeaseHolders(prev => prev.map((lh, i) => i === index ? { ...lh, [field]: value } : lh));
  };

  // Snackbar for validation + soft errors; Dialog for the celebratory success state.
  const [snack, setSnack] = useState<{ open: boolean; severity: AlertColor; message: string }>({
    open: false,
    severity: "error",
    message: "",
  });
  const showSnack = (severity: AlertColor, message: string) =>
    setSnack({ open: true, severity, message });
  const closeSnack = () => setSnack(s => ({ ...s, open: false }));

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailTouched(true);
      showSnack("error", "Please enter a valid e-mail address.");
      return;
    }

    if (!moveDate) {
      showSnack("error", "Please enter a requested moving date.");
      return;
    }

    // Reject move-in dates that land before today (stripped to midnight so a
    // selection of "today" is valid regardless of the current time of day).
    const selectedDate = new Date(dateYear, dateMonth - 1, dateDay);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selectedDate < todayMidnight) {
      showSnack("error", "The requested move-in date must be today or later.");
      return;
    }

    const totalOccupants = Object.values(occupantCounts).reduce((a, b) => a + b, 0);
    if (totalOccupants < 1) {
      showSnack("error", "Please add at least one occupant.");
      return;
    }

    if ((occupantCounts["Other"] || 0) > 0 && !occupantOtherText.trim()) {
      showSnack("error", "Please describe the occupant(s) listed as 'Other'.");
      return;
    }

    if (!reasonForMove.trim()) {
      showSnack("error", "Please enter a reason for the move.");
      return;
    }

    // At least one lease-holder must be fully filled (name + occupation). Any other
    // row the user started must also be complete. Yearly income stays optional.
    const startedLeaseHolders = leaseHolders.filter(
      lh => lh.name.trim() || lh.occupation.trim() || lh.yearlyIncome.trim() || lh.linkWithApplicant.trim()
    );
    const completeLeaseHolders = leaseHolders.filter(
      lh => lh.name.trim() && lh.occupation.trim() &&
        (lh.role !== "co-signer" || lh.linkWithApplicant.trim())
    );
    if (completeLeaseHolders.length < 1) {
      showSnack("error", "Please fill in at least one lease-holder's information.");
      return;
    }
    if (startedLeaseHolders.length > completeLeaseHolders.length) {
      showSnack("error", "Each lease-holder row needs a name and an occupation (link with applicant is also required for co-signers).");
      return;
    }

    if (otherAnimalCount > 0 && !otherAnimalText.trim()) {
      showSnack("error", "Please describe the other animals.");
      return;
    }

    if (!smokerAny) {
      showSnack("error", "Please indicate whether any of the occupants are smokers.");
      return;
    }

    const listingTitle = listingData?.listing?.title || id || "Unit";
    const listingAddress = displayAddress || "";
    const subject = `${listingTitle}${listingAddress ? " - " + listingAddress : ""} Visit Request`;

    const locale = language === "fr" ? "fr-CA" : "en-CA";
    const moveDateObj = new Date(dateYear, dateMonth - 1, dateDay);
    const humanMoveDate = moveDateObj.toLocaleDateString(locale, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const humanSubmittedAt = new Date().toLocaleString(locale, {
      dateStyle: "medium", timeStyle: "short",
    });

    // Only include occupant types that have a count; tack on the "Other"
    // description inline so there's no orphan field in the email.
    const occupantLines = Object.entries(occupantCounts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => {
        if (k === "Other" && occupantOtherText.trim()) {
          return `  - ${k}: ${v} (${occupantOtherText.trim()})`;
        }
        return `  - ${k}: ${v}`;
      });
    const occupantsBreakdown = occupantLines.length ? occupantLines.join("\n") : "  (none)";

    // Animals: only list kinds that are present, show "None" if zero total.
    const animalLines = [
      dogCount > 0 ? `  - Dogs: ${dogCount}` : null,
      catCount > 0 ? `  - Cats: ${catCount}` : null,
      otherAnimalCount > 0
        ? `  - Other: ${otherAnimalCount}${otherAnimalText.trim() ? ` (${otherAnimalText.trim()})` : ""}`
        : null,
    ].filter(Boolean);
    const animalsBreakdown = animalLines.length ? animalLines.join("\n") : "None";

    // Only include lease-holders the applicant actually filled in. Income is optional.
    const leaseHoldersText = leaseHolders
      .filter(lh => lh.name.trim() || lh.occupation.trim())
      .map((lh, i) => {
        const role = lh.role === "co-signer" ? "Co-signer" : "Tenant";
        const parts = [`  ${i + 1}. ${role}: ${lh.name.trim() || "(unnamed)"}`];
        if (lh.role === "co-signer" && lh.linkWithApplicant.trim()) {
          parts.push(`     Link with applicant: ${lh.linkWithApplicant.trim()}`);
        }
        parts.push(`     Occupation: ${lh.occupation.trim() || "—"}`);
        if (lh.yearlyIncome.trim()) {
          parts.push(`     Approx. yearly income: ${lh.yearlyIncome.trim()}`);
        }
        return parts.join("\n");
      })
      .join("\n\n");

    const payload = {
      "Listing":               listingAddress ? `${listingTitle} — ${listingAddress}` : listingTitle,
      "Applicant Email":       email,
      "Requested Move-In":     humanMoveDate,
      "Reason for the Move":   reasonForMove.trim(),
      "Total Occupants":       totalOccupants,
      "Occupants":             "\n" + occupantsBreakdown,
      "Lease Holders":         "\n" + leaseHoldersText,
      "Animals":               animalLines.length ? "\n" + animalsBreakdown : "None",
      "Any Smokers?":          smokerAny === "yes" ? "Yes" : "No",
      "Additional Notes":      additional.trim() || "(none)",
      "Submitted At":          humanSubmittedAt,
    };

    if (EXTERNAL_URLS.BOOKING_API) {
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ subject, ...payload }),
      };

      fetch(EXTERNAL_URLS.BOOKING_API, fetchOptions)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to submit");
          setSubmitted(true);
        })
        .catch(() => {
          showSnack("warning", "Submission failed — opening your email client instead.");
          const body = Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join("\n\n");
          window.location.href = `${EXTERNAL_URLS.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    } else {
      const body = Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join("\n\n");
      window.location.href = `${EXTERNAL_URLS.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <BookingContainer maxWidth="md">
      <Header setMode={setMode} alignWithContainer />

      <Button
        style={{ position: "sticky", top: 0, zIndex: 2, marginBottom: 8 }}
        onClick={() => { if (id) navigate(`/listings/${id}`); else navigate("/listings"); }}
        startIcon={<NavigateBefore sx={{ fontSize: 28 }} />}
        sx={{ fontSize: "1rem", textTransform: "none" }}
      >
        Back to Listing
      </Button>

      <Typography variant="h4" style={{ margin: "8px 0 16px 0" }}>
        Submit a Visit Request
      </Typography>

      {/* Confirmation card — left: carousel, right: details + map link */}
      {listingData?.listing && (
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>

          {/* Left — carousel with availability badge */}
          <Paper elevation={3} sx={{ flex: 1, borderRadius: 3, overflow: "hidden", minWidth: 0 }}>
            <Box sx={{ position: "relative" }}>
              {images.length > 0 && (
                <ImageCarousel images={images} aspectRatio={1.3} showPreviews={images.length > 1} />
              )}
              {availabilityBadge && (
                <Box sx={{
                  position: "absolute", top: 10, left: 10, zIndex: 10,
                  bgcolor: "primary.main", color: "primary.contrastText",
                  px: 1.5, py: 0.5, borderRadius: 1,
                  fontSize: "0.85rem", fontWeight: 700, pointerEvents: "none",
                }}>
                  {availabilityBadge}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Right — details on top, map below */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>

            {/* Details card */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 0.75 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                onClick={() => navigate(`/listings/${id}`)}
                sx={{ textAlign: "center", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                {listingData.listing.title}
              </Typography>

              {listingData.listing.shortKeyDescription && (
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", fontStyle: "italic" }}
                >
                  {listingData.listing.shortKeyDescription}
                </Typography>
              )}

              <Divider sx={{ my: 0.25 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
                {!!listingData.listing.bedrooms && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BedOutlined fontSize="small" />
                    <Typography variant="body2">
                      {listingData.listing.bedrooms} {listingData.listing.bedrooms > 1 ? t("common.bedrooms") : t("common.bedroom")}
                    </Typography>
                  </Box>
                )}
                {!!listingData.listing.bathrooms && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ShowerOutlined fontSize="small" />
                    <Typography variant="body2">
                      {listingData.listing.bathrooms} {listingData.listing.bathrooms > 1 ? t("common.bathrooms") : t("common.bathroom")}
                    </Typography>
                  </Box>
                )}
                {listingData.listing.squareFootage && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SpaceDashboardOutlined fontSize="small" />
                    <Typography variant="body2">{listingData.listing.squareFootage} {t("common.sqft")}</Typography>
                  </Box>
                )}
                {listingData.listing.price && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocalAtm fontSize="small" />
                    <Typography variant="body2">
                      {formatCurrency({ amount: listingData.listing.price, language })} / {t("common.month")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Map — explicit height so Mapbox renders; overlay opens Google Maps on click */}
            {features && (
              <Box sx={{ borderRadius: 3, overflow: "hidden", position: "relative", height: 260, flexShrink: 0 }}>
                <Map features={features} allowMarkerPopups={false} />
                {googleMapsUrl && (
                  <Box
                    component="a"
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Google Maps"
                    sx={{ position: "absolute", inset: 0, display: "block", zIndex: 10, cursor: "pointer" }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}

      <form onSubmit={handleSubmit}>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            E-mail{" "}
            <span style={{ fontWeight: 400, fontSize: "0.88rem" }}>
              (We will e-mail you to schedule a visit quickly after receiving this short form)
            </span>
          </Typography>
          <TextField
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            error={emailInvalid}
            helperText={emailInvalid ? "Please enter a valid e-mail address." : " "}
          />
        </FormRow>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Describe and include all occupants{" "}
            <span style={{ fontWeight: 400, fontSize: "0.88rem" }}>
              (People who will be <u>living</u> in the premises, co-signers, to be added later)
            </span>
          </Typography>
          <Grid container spacing={1}>
            {Object.keys(occupantCounts).map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Typography style={{ flex: 1 }}>{type}</Typography>
                  <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setOccupantCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{occupantCounts[type]}</Typography>
                  <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setOccupantCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))}>
                    <AddIcon />
                  </IconButton>
                </div>
                {type === "Other" && occupantCounts["Other"] > 0 && (
                  <TextField placeholder="Describe other occupants" value={occupantOtherText} onChange={(e) => setOccupantOtherText(e.target.value)} sx={{ marginTop: 1 }} />
                )}
              </Grid>
            ))}
          </Grid>
        </FormRow>

        {/* Date picker with left/right arrow steppers */}
        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Requested moving date{" "}
            <span style={{ fontWeight: 400, fontSize: "0.88rem" }}>(Earliest move-in date possible)</span>
          </Typography>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
            <DateStepper
              label="Day"
              display={String(dateDay)}
              onDecrement={() => setDateDay(d => d <= 1 ? maxDay : d - 1)}
              onIncrement={() => setDateDay(d => d >= maxDay ? 1 : d + 1)}
            />
            <DateStepper
              label="Month"
              display={MONTHS_FULL[dateMonth - 1]}
              onDecrement={() => setDateMonth(m => m <= 1 ? 12 : m - 1)}
              onIncrement={() => setDateMonth(m => m >= 12 ? 1 : m + 1)}
            />
            <DateStepper
              label="Year"
              display={String(dateYear)}
              onDecrement={() => setDateYear(y => Math.max(today.getFullYear(), y - 1))}
              onIncrement={() => setDateYear(y => y + 1)}
            />
          </Box>
        </FormRow>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>What is the reason for the move?</Typography>
          <TextField value={reasonForMove} onChange={(e) => setReasonForMove(e.target.value)} multiline rows={2} />
        </FormRow>

        {/* Lease-holders: role dropdown first, then name / occupation / income on one line */}
        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Who will sign the lease?{" "}
            <span style={{ fontWeight: 400, fontSize: "0.88rem" }}>
              (List all signing tenants and co-signers, if any)
            </span> 
          </Typography>
          {leaseHolders.map((lh, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                {/* Role dropdown — leftmost */}
                <Select
                  size="small"
                  value={lh.role}
                  onChange={(e) => updateLeaseHolder(index, "role", e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="tenant">Tenant</MenuItem>
                  <MenuItem value="co-signer">Co-signer</MenuItem>
                </Select>

                <TextField
                  size="small"
                  placeholder="Name"
                  value={lh.name}
                  onChange={(e) => updateLeaseHolder(index, "name", e.target.value)}
                  sx={{ flex: 2, minWidth: 110 }}
                />
                <TextField
                  size="small"
                  placeholder="Occupation"
                  value={lh.occupation}
                  onChange={(e) => updateLeaseHolder(index, "occupation", e.target.value)}
                  sx={{ flex: 2, minWidth: 140 }}
                />
                <TextField
                  size="small"
                  placeholder="Approx. yearly income"
                  value={lh.yearlyIncome}
                  onChange={(e) => updateLeaseHolder(index, "yearlyIncome", e.target.value)}
                  sx={{ flex: 1.5, minWidth: 120 }}
                />
                {/* Only show remove on entries beyond the first two */}
                {index >= 2 && (
                  <IconButton
                    size="small"
                    onClick={() => setLeaseHolders(prev => prev.filter((_, i) => i !== index))}
                    sx={{ color: "text.secondary", flexShrink: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Link with applicant — shown only when co-signer is selected */}
              {lh.role === "co-signer" && (
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Link with applicant (parent, friend, relative, etc.)"
                  value={lh.linkWithApplicant}
                  onChange={(e) => updateLeaseHolder(index, "linkWithApplicant", e.target.value)}
                  sx={{ mt: 0.75 }}
                />
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => setLeaseHolders(prev => [...prev, { ...EMPTY_LEASE_HOLDER }])}
            sx={{ textTransform: "none", alignSelf: "flex-start", mt: 0.5 }}
          >
            Add lease-holder
          </Button>
        </FormRow>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>Animals</Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography style={{ width: 60 }}>Dog</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setDogCount(Math.max(0, dogCount - 1))}><RemoveIcon /></IconButton>
              <Typography>{dogCount}</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setDogCount(dogCount + 1)}><AddIcon /></IconButton>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography style={{ width: 60 }}>Cat</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setCatCount(Math.max(0, catCount - 1))}><RemoveIcon /></IconButton>
              <Typography>{catCount}</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setCatCount(catCount + 1)}><AddIcon /></IconButton>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography style={{ width: 60 }}>Other</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setOtherAnimalCount(Math.max(0, otherAnimalCount - 1))}><RemoveIcon /></IconButton>
              <Typography>{otherAnimalCount}</Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => setOtherAnimalCount(otherAnimalCount + 1)}><AddIcon /></IconButton>
            </div>
          </div>
          {otherAnimalCount > 0 && (
            <TextField placeholder="Describe other animals" value={otherAnimalText} onChange={(e) => setOtherAnimalText(e.target.value)} />
          )}
        </FormRow>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>Are any of the occupants smokers?</Typography>
          <RadioGroup row value={smokerAny} onChange={(e) => setSmokerAny(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormRow>

        <FormRow>
          <Typography style={{ color: theme.palette.primary.main, fontWeight: 600 }}>Additional information, details or questions?</Typography>
          <TextField value={additional} onChange={(e) => setAdditional(e.target.value)} multiline rows={4} />
        </FormRow>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" sx={{ textTransform: "uppercase" }}>SEND VISIT REQUEST</Button>
        </Box>
      </form>

      {/* Validation + soft-error snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={closeSnack}
          sx={{ width: "100%", borderRadius: 2, fontSize: "0.95rem" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Success dialog — opens after a successful submission */}
      <Dialog
        open={submitted}
        onClose={() => setSubmitted(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: "8px 4px 4px" } }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <CheckCircleOutline sx={{ fontSize: 56, color: "primary.main", display: "block", mx: "auto", mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>Visit request sent</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            We'll be in touch shortly to schedule your visit time.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Please <u>monitor your inbox</u> (and spam folder, just in case) for our reply.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Thank you!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            size="large"
            disableElevation
            onClick={() => {
              setSubmitted(false);
              if (id) navigate(`/listings/${id}`);
              else navigate("/listings");
            }}
            sx={{ textTransform: "uppercase", minWidth: 160 }}
          >
            Back to listing
          </Button>
        </DialogActions>
      </Dialog>
    </BookingContainer>
  );
};

export default Booking;
