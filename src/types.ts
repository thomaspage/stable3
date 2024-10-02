import { Amenities } from "./constants";

export interface Image {
  url: string;
  description?: string;
  title?: string;
  sys?: {
    id: string;
  };
}

export type Amenities = (typeof Amenities)[number];
