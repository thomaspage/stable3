/**
 * Props for the Filters component
 */
export interface FilterOptions {
  bedrooms: number[];
  bathrooms: number[];
  cities: string[];
  sqftMin: number;
  sqftMax: number;
  amenities: string[];
}

export interface FiltersProps {
  filters: FilterTypes;
  setFilters: (filters: FilterTypes) => void;
  options: FilterOptions;
  onClose?: () => void;
}

export interface FilterTypes {
  amenitiesContainsAll?: string[];
  availableDate?: string;
  bedroomsIn?: number[];
  bathroomsIn?: number[];
  cityIn?: string[];
  priceMin?: number;
  priceMax?: number;
  sqftMin?: number;
  sqftMax?: number;
}