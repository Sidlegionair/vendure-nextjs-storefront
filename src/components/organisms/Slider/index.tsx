import React, { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface SliderProps {
    withDots?: boolean;
    spacing?: number; // Spacing in pixels
    slides: ReactNode[];
    loop?: boolean;
    height?: string; // Optional height for the slider
    slideWidth?: string; // Forced width for each slide, e.g. "300px"
}

export const Slider: React.FC<SliderProps> = ({
                                                  slides,
                                                  withDots = false,
                                                  spacing = 60,
                                                  loop = true,
                                                  height = 'auto',
                                                  slideWidth = '300px',
                                              }) => {
    if (!slides?.length) return null;

    // Get viewport width to determine how many slides can fit.
    const [containerWidth, setContainerWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    );

    useEffect(() => {
        const handleResize = () => setContainerWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate how many slides fit in view based on the forced width.
    const forcedSlideWidth = parseInt(slideWidth, 10) || 300;
    const slidesInView = Math.max(1, Math.floor(containerWidth / forcedSlideWidth));

    // For loop mode with auto slides, define loopedSlides and additional slides.
    // const loopedSlides = loop ? Math.max(slides.length, slidesInView) : undefined;

    return (
        <StyledSwiper
            modules={[Pagination, A11y]}
            spaceBetween={spacing}
            slidesPerView="auto" // Forced slide widths are respected
            pagination={withDots ? { clickable: true } : undefined}
            loop={loop}
            loopAdditionalSlides={slidesInView} // Provide additional looped slides for smooth swiping
            autoHeight={height === 'auto'}
            style={{ height }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} style={{ width: slideWidth }}>
                    {slide}
                </SwiperSlide>
            ))}
        </StyledSwiper>
    );
};

const StyledSwiper = styled(Swiper)`
    width: 100%;

    .swiper-pagination-bullet {
        background: #ccc;
        opacity: 1;
    }

    .swiper-pagination-bullet-active {
        background: #000;
    }
`;
