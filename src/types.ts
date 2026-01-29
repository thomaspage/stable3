import { Amenities } from "./constants";

/**
 * Represents an image asset from Contentful CMS
 */
export interface Image {
  /** Full URL to the image resource */
  url: string;
  /** Optional description of the image */
  description?: string;
  /** Optional title/alt text for the image */
  title?: string;
  /** Contentful system metadata */
  sys?: {
    /** Unique identifier for the image */
    id: string;
  };
}

/**
 * Union type of all available amenities
 * Derived from the Amenities constant array
 */
export type Amenity = (typeof Amenities)[number];
