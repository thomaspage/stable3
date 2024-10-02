import { Image } from "../../types";

export interface Feature {
    location: {
        lat: number;
        lon: number;
    };
    title: string;
    description: string;
    images: Image[];
    id: string;
    price: number;
}

export interface MapProps {
    features: Feature[];
    onPopupClick?: (feature: Feature) => void;
}