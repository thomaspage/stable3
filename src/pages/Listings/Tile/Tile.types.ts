import { Image } from "../../../types";

export interface TileProps {
  id: string;
  availableDate: string;
  title: string;
  // description: string;
  price: number;
  bathrooms: number;
  bedrooms: number;
  // rating: number;
  // thumbnail: string;
  images: Image[];
  // fullAddress: string;
  squareFootage: number;
  active: boolean;
}
