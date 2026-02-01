import { Image } from "../../types";

/**
 * Represents a map feature/marker for a rental listing
 */
export interface Feature {
    /** Geographic coordinates */
    location: {
        lat: number;
        lon: number;
    };
    /** Listing title */
    title: string;
    /** Brief description */
    description?: string;
    /** Array of listing images */
    images?: Image[];
    /** Unique identifier */
    id: string;
    /** Monthly rent price */
    price?: number;
    /** Optional highlights */
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    address?: string;
    availableDate?: string;
}

/**
 * Props for the Map component
 */
export interface MapProps {
    /** Array of listing features to display on the map */
    features: Feature[];
    /** Optional callback when a map popup/marker is clicked */
    onPopupClick?: (feature: Feature) => void;
    /** When false, clicking markers does not open popups (used on single-listing page) */
    allowMarkerPopups?: boolean;
}