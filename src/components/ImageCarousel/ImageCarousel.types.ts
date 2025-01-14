import { Image } from "../../types";

export interface ImageCarouselProps {
    images: Image[];
    className?: HTMLElement["className"];
    onClick?: (index: number) => void;
    showPreviews?: boolean;
    aspectRatio?: number;
    popup?: boolean
    startIndex?: number;
}