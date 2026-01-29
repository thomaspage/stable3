/**
 * Props for the Filters component
 */
export interface FiltersProps {
  /** Current filter values */
  filters: FilterTypes;
  /** Callback to update filter values */
  setFilters: (filters: FilterTypes) => void;
}

/**
 * Type definition for listing filters
 * All fields are optional to allow partial filtering
 */
export interface FilterTypes {
  /** Filter by amenities (must have all specified) */
  amenitiesContainsAll?: string[];
  /** Filter by available date (ISO string) */
  availableDate?: string;
  /** Filter by number of bedrooms (any of the specified values) */
  bedroomsIn?: number[];
  /** Filter by number of bathrooms (any of the specified values) */
  bathroomsIn?: number[];
  /** Minimum monthly rent */
  priceMin?: number;
  /** Maximum monthly rent */
  priceMax?: number;
}