import {
  BlurredImage,
  Image,
  ImageCarouselContainer,
  NavigationButton,
  NavigationButtons,
  PreviewImage,
  PreviewImages,
  Slide,
  Slides,
  StyledModal,
} from "./ImageCarousel.styles";
import { ImageCarouselProps } from "./ImageCarousel.types";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Modal } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper from 'swiper/react';
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./ImageCarousel.css";

const ImageCarousel = ({
  className,
  images,
  onClick,
  showPreviews,
  aspectRatio,
  popup,
  startIndex,
}: ImageCarouselProps) => {
  // const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex});

  return (
    <>
      <ImageCarouselContainer className={className} style={{ margin: "auto" }}>
        <Slides modules={[Navigation, Pagination]} navigation={{}}>
          {images.map((image, index) => {
            return (
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
                  // // @ts-ignore don't feel like fixing this
                  // fetchPriority={index === (startIndex || 0) ? "high" : "low"}
                />
              </Slide>
            );
          })}
        </Slides>
      </ImageCarouselContainer>
      {/* {showPreviews && (
        <PreviewImages>
          {images.map((image, index) => {
            return (
              <PreviewImage
                key={image.sys?.id || index}
                src={`${image.url}?h=50`}
                alt={image.title}
                onClick={() => handlePreviewClick(index)}
              />
            );
          })}
        </PreviewImages>
      )} */}
    </>
  );
};

export default ImageCarousel;
