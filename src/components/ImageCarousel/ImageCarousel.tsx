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
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@mui/material";

const ImageCarousel = ({
  className,
  images,
  onClick,
  showPreviews,
  aspectRatio,
  popup,
  startIndex,
}: ImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex});

  const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevButtonDisabled(!emblaApi.canScrollPrev());
    setNextButtonDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const handlePreviewClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <>
      <ImageCarouselContainer
        className={className}
        onClick={(e) => e.preventDefault()}
        ref={emblaRef}
        style={{ margin: "auto" }}
      >
        <Slides>
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
                />
              </Slide>
            );
          })}
        </Slides>
        <NavigationButtons>
          <NavigationButton
            disabled={prevButtonDisabled}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <NavigateBefore />
          </NavigationButton>

          <NavigationButton
            disabled={nextButtonDisabled}
            onClick={() => emblaApi?.scrollNext()}
          >
            <NavigateNext />
          </NavigationButton>
        </NavigationButtons>
      </ImageCarouselContainer>
      {showPreviews && (
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
      )}

    </>
  );
};

export default ImageCarousel;
