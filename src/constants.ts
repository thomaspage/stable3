/**
 * List of available amenities for rental listings.
 * Used for filtering and displaying property features.
 */
export const Amenities = [
  "washer",
  "dryer",
  "dishwasher",
  "storage",
  "oven",
  "stove",
  "refrigerator",
  "elevator",
  "electricity",
  "pets",
  "parking",
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
  MIN: 0,
  MAX: 2000,
  STEP: 50,
} as const;

/**
 * External URLs used throughout the application
 */
export const EXTERNAL_URLS = {
  GOOGLE_FORM: "https://docs.google.com/forms/d/e/1FAIpQLSdiyd8JK8_U-QHjvppensyQkHpMouI8b2cP6O6N_tfTjwZngw/viewform?usp=sf_link",
  EMAIL: "mailto:stabl3.rental@gmail.com",
  GOOGLE_SCRIPT: "https://script.google.com/macros/s/AKfycbxgzAIEWC2Ijq3_ot56bgIWB7QEBh0mTY0xW1BLUbMtZS6WCm-F7tLbfQ0wYBoC5JLs9A/exec",
} as const;
