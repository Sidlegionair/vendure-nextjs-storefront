import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowLeft, ArrowRight } from '@/src/assets/svg';

interface SliderProps {
    withDots?: boolean;
    withArrows?: boolean;
    spacing?: number; // Spacing in pixels
    slides: ReactNode[];
    loop?: boolean;
    height?: string; // Optional height for the slider
    slideWidth?: string; // Optional width for each slide
}

export const Slider: React.FC<SliderProps> = ({
                                                  slides,
                                                  withArrows = false,
                                                  withDots = false,
                                                  spacing = 60,
                                                  loop = true,
                                                  height = 'auto', // Default height is auto
                                                  slideWidth = 'auto', // Default width for slides
                                              }) => {
    if (!slides?.length) return null;

    // Dynamic breakpoints for responsive slidesPerView
    const dynamicBreakpoints = {
        0: { slidesPerView: 2 }, // Mobile
        640: { slidesPerView: 5 }, // Small tablets
        1024: { slidesPerView: 8 }, // Desktops
        1920: { slidesPerView: 10 }, // Full HD
        2560: { slidesPerView: 15 }, // 2K
        3840: { slidesPerView: 15 }, // 4K
    };

    // Get maximum slidesPerView for duplication logic
    const maxSlidesPerView = Math.max(...Object.values(dynamicBreakpoints).map(b => b.slidesPerView));

    // Duplicate slides to ensure seamless looping
    const extendedSlides = loop
        ? Array.from({ length: Math.ceil(maxSlidesPerView * 2 / slides.length) })
            .flatMap(() => slides)
        : slides;

    return (
        <StyledSwiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={spacing}
            slidesPerView={1}
            navigation={withArrows ? { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' } : false}
            pagination={withDots ? { clickable: true } : undefined}
            loop={loop}
            breakpoints={dynamicBreakpoints}
            autoHeight={height === 'auto'}
            style={{ height }} // Apply height directly
        >
            {extendedSlides.map((slide, index) => (
                <SwiperSlide key={index} style={{ width: slideWidth }}>
                    {slide}
                </SwiperSlide>
            ))}

            {withArrows && (
                <>
                    <CustomButton className="swiper-button-prev">
                        <ArrowLeft />
                    </CustomButton>
                    <CustomButton className="swiper-button-next">
                        <ArrowRight />
                    </CustomButton>
                </>
            )}
        </StyledSwiper>
    );
};

// Styled Components

const StyledSwiper = styled(Swiper)`
    width: 100%;

    .swiper-pagination-bullet {
        background: #ccc; /* Default dot color */
        opacity: 1;
    }

    .swiper-pagination-bullet-active {
        background: #000; /* Active dot color */
    }
`;

const CustomButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;
