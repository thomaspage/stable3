import { Image } from "../../../types";

/**
 * Props for the Tile component (listing preview card)
 */
export interface TileProps {
  /** Unique listing identifier */
  id: string;
  /** ISO date string for when the listing becomes available */
  availableDate: string;
  /** Listing title */
  title: string;
  /** Optional short description */
  description?: string;
  /** Monthly rent price */
  price: number;
  /** Number of bathrooms */
  bathrooms: number;
  /** Number of bedrooms */
  bedrooms: number;
  /** Array of listing images */
  images: Image[];
  /** Square footage of the property */
  squareFootage: number;
  /** Whether this tile is currently active/highlighted */
  active: boolean;
  /** Whether the listing has been rented */
  rented: boolean;
}
