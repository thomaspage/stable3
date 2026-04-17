/**
 * List of available amenities for rental listings.
 * Used for filtering and displaying property features.
 */
export const Amenities = [
  // --- Inclusions / Exclusions ---
  // Utilities
  "Electricity Excluded",
  "Electricity Included",
  "Heating Excluded",
  "Heating Included",
  "Internet Included",
  // Air conditioning
  "Air Conditionning Included (Central)",
  "Air Conditionning Included (Wall Unit)",
  // Appliances
  "Appliances Excluded",
  "Refrigerator Included",
  "Stove Included",
  "Washer Included",
  "Dryer Included",
  "Dishwasher Included",
  "Dishwasher Excluded",
  // Laundry
  "Washer Dryer Connections",
  "Shared Laundry Room",
  // Parking
  "One Parking Available",
  "Two Parking Available",
  "Parking on Street Available",
  "Indoor Parking Available",
  // Furnishings
  "Furnished Unit",
  "Partly Furnished",

  // --- Pet Policy ---
  "Pets Not Accepted",
  "Pets Accepted",
  "Cats Accepted",
  "Dogs Accepted",
  "1 Dog Accepted",
  "1 Cat Accepted",

  // --- Additional Features ---
  // Spotlight (exceptional — always first)
  "Clean Prior Tenants",
  // Kitchen
  "Full Size Pantry",
  // Floor / unit configuration
  "Lowest Floor",
  "Ground Floor",
  "2nd Floor",
  "3rd Floor",
  "Highest Floor",
  "On Two Floors (In-Unit Staircase)",
  // Building quality
  "New",
  "Luxury",
  "Recent Renovations",
  // Unit features
  "Balcony/Patio Included",
  "Exterior Storage Available",
  // Building amenities
  "Alarm System Available",
  "Elevator Available",
  "Lobby Available",
  "Secured Entry Available",
  "Concierge On-site",
  // Proximity
  "Close to Gym",
  "Close to Public Transit",
  "Close to Daycare",
] as const;

/**
 * Default map center coordinates for Montreal area
 */
export const DEFAULT_MAP_CENTER: [number, number] = [-75, 45];

/**
 * Default map zoom level
 */
export const DEFAULT_MAP_ZOOM = 5;

/**
 * Zoom level for single listing view on map
 */
export const SINGLE_LISTING_ZOOM = 12;

/**
 * Price range constants for filtering
 */
export const PRICE_RANGE = {
  MIN: 500,
  MAX: 2500,
  STEP: 10,
} as const;

/**
 * External URLs used throughout the application
 */
const STABL3_EMAIL_ADDRESS = "stabl3.rental@gmail.com";

export const EXTERNAL_URLS = {
  GOOGLE_FORM: "https://docs.google.com/forms/d/e/1FAIpQLSdiyd8JK8_U-QHjvppensyQkHpMouI8b2cP6O6N_tfTjwZngw/viewform?usp=sf_link",
  EMAIL_ADDRESS: STABL3_EMAIL_ADDRESS,
  EMAIL: `mailto:${STABL3_EMAIL_ADDRESS}`,
  // Formbold endpoint for booking submissions
  BOOKING_API: "https://formbold.com/s/oJq8Y",
} as const;
