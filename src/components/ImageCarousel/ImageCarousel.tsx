import { useState, useRef } from "react";
import {
  BlurredImage,
  Image,
  ImageCarouselContainer,
  Slide,
  Slides,
  PreviewImages,
  PreviewImage,
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
  showPreviews,
}: ImageCarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<any | null>(null);

  // Determine whether to show previews: explicit prop OR mobile/tablet by default
  const shouldShowPreviews = showPreviews ?? undefined;

  return (
    <ImageCarouselContainer className={className} style={{ margin: "auto" }}>
      <Slides modules={[Navigation, Pagination]} navigation={{}} onSwiper={setSwiperInstance}>
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

      {/* Show simple preview thumbnails for quick swipe affordance (particularly useful on mobile/tablet) */}
      {(showPreviews ?? false) && images.length > 1 && (
        <PreviewImages>
          {images.map((img, idx) => (
            <PreviewImage
              key={img.sys?.id || idx}
              src={`${img.url}?w=200`}
              onClick={() => swiperInstance?.slideTo(idx)}
            />
          ))}
        </PreviewImages>
      )}
    </ImageCarouselContainer>
  );
};

export default ImageCarousel;
