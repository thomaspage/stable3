import {
  BlurredImage,
  Image,
  ImageCarouselContainer,
  Slide,
  Slides,
} from "./ImageCarousel.styles";
import { ImageCarouselProps } from "./ImageCarousel.types";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./ImageCarousel.css";

/**
 * Image carousel component using Swiper
 * Displays images with navigation and pagination controls
 */
const ImageCarousel = ({
  className,
  images,
  onClick,
  aspectRatio,
}: ImageCarouselProps) => {
  return (
    <ImageCarouselContainer className={className} style={{ margin: "auto" }}>
      <Slides modules={[Navigation, Pagination]} navigation={{}}>
        {images.map((image, index) => (
          <Slide
            $clickable={!!onClick}
            onClick={() => onClick?.(index)}
            key={image.sys?.id || index}
          >
            <BlurredImage src={`${image.url}?w=1000`} alt={image.title} />
            <Image
              $aspectRatio={aspectRatio || 1.35}
              src={`${image.url}?w=1000`}
              alt={image.title}
            />
          </Slide>
        ))}
      </Slides>
    </ImageCarouselContainer>
  );
};

export default ImageCarousel;
