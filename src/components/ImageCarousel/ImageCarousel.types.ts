import { Image } from "../../types";

/**
 * Props for the ImageCarousel component
 */
export interface ImageCarouselProps {
    /** Array of images to display in the carousel */
    images: Image[];
    /** Optional CSS class name for styling */
    className?: HTMLElement["className"];
    /** Optional callback when an image is clicked */
    onClick?: (index: number) => void;
    /** Whether to show image previews (currently not implemented) */
    showPreviews?: boolean;
    /** Aspect ratio for the images (default: 1.35) */
    aspectRatio?: number;
    /** Whether carousel is displayed in a popup (currently not used) */
    popup?: boolean;
    /** Starting index for the carousel (currently not used) */
    startIndex?: number;
}