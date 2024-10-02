import { Image } from "../../../types";

export interface FiltersProps {
    // title: string;
    filters: FilterTypes;
    setFilters: (filters: FilterTypes) => void;
  }
  

  export interface FilterTypes {
    amenitiesContainsAll?: string[];
    availableDate?: string;
    bedroomsIn?: number[];
    bathroomsIn?: number[];
    priceMin?: number;
    priceMax?: number;
  }