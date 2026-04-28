import { useEffect, useState } from "react";
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

// Per-slide content. Detects the source image's orientation and only renders
// the blurred backdrop for portrait images — landscape images use object-fit: cover
// to fill the tile cleanly without any blur framing them.
const SlideContent = ({
  image,
  popup,
  aspectRatio,
}: {
  image: { url: string; title?: string; description?: string; sys?: { id: string } };
  popup?: boolean;
  aspectRatio?: number;
}) => {
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setIsPortrait(probe.naturalHeight > probe.naturalWidth);
    probe.src = `${image.url}?w=1000`;
  }, [image.url]);

  // popup (lightbox modal): always show full image with blurred backdrop, regardless of orientation.
  // tile (non-popup): landscape fills via cover, portrait keeps backdrop + contain.
  const showBlur = popup || !!isPortrait;
  const fit: "contain" | "cover" = popup ? "contain" : isPortrait ? "contain" : "cover";

  return (
    <>
      {showBlur && <BlurredImage src={`${image.url}?w=1000`} alt={image.title} />}
      <Image
        $aspectRatio={aspectRatio || 1.35}
        src={`${image.url}?w=1000`}
        alt={image.title}
        style={{ objectFit: fit }}
      />
    </>
  );
};

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
  popup,
  style,
  startIndex,
}: ImageCarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<any | null>(null);

  // Determine whether to show previews: explicit prop or fallback to false
  const shouldShowPreviews = showPreviews ?? false;

  return (
    <ImageCarouselContainer className={className} style={{ margin: "auto", ...(style || {}) }}>
      <Slides
        modules={[Navigation, Pagination]}
        navigation={{}}
        onSwiper={(s: any) => {
          setSwiperInstance(s);
          if (typeof startIndex === "number" && startIndex > 0) {
            s.slideTo(startIndex, 0);
          }
        }}
        initialSlide={startIndex || 0}
      >
        {images.map((image, index) => (
          <Slide
            $clickable={!!onClick}
            onClick={() => onClick?.(index)}
            key={image.sys?.id || index}
          >
            <SlideContent image={image} popup={popup} aspectRatio={aspectRatio} />
          </Slide>
        ))}
      </Slides>

      {/* Show simple preview thumbnails for quick swipe affordance (particularly useful on mobile/tablet) */}
      {shouldShowPreviews && images.length > 1 && (
        <PreviewImages>
          {images.map((img, idx) => (
            <PreviewImage
              key={img.sys?.id || idx}
              src={`${img.url}?w=200`}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); swiperInstance?.slideTo(idx); }}
            />
          ))}
        </PreviewImages>
      )}
    </ImageCarouselContainer>
  );
};

export default ImageCarousel;
