import React, { ReactNode, useEffect, useState } from 'react';
import { useSlider } from './hooks';
import styled from '@emotion/styled';
import { Stack } from '@/src/components/atoms';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from '@/src/assets/svg';

interface SliderProps {
    withDots?: boolean;
    withArrows?: boolean;
    spacing?: number; // Keep as number
    slides: ReactNode[];
}

export const Slider: React.FC<SliderProps> = ({
                                                  slides,
                                                  withArrows,
                                                  withDots,
                                                  spacing = 1 // spacing as a number
                                              }) => {
    const [duplicatedSlides, setDuplicatedSlides] = useState<ReactNode[]>(slides);
    const [visibleSlides, setVisibleSlides] = useState<number>(1);

    const determineVisibleSlides = (): number => {
        const width = window.innerWidth;
        if (width >= 2000) return 8;
        if (width >= 1200) return 6;
        if (width >= 992) return 4;
        if (width >= 768) return 3;
        return 2;
    };

    useEffect(() => {
        const handleResize = () => {
            const visSlides = determineVisibleSlides();
            setVisibleSlides(visSlides);

            const requiredSlides = visSlides * 2;
            let newSlides = [...slides];
            while (newSlides.length < requiredSlides) {
                newSlides = [...newSlides, ...slides];
            }
            setDuplicatedSlides(newSlides);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slides]);

    if (!duplicatedSlides.length) return null;

    // Removed `visibleSlides` from useSlider call, as it's not defined in useSlider's type
    const { jsEnabled, ref, nextSlide, prevSlide, goToSlide, currentSlide } = useSlider({
        spacing,
        loop: duplicatedSlides.length > visibleSlides,
    });

    return (
        <Wrapper column>
            <Content>
                {jsEnabled && withArrows && duplicatedSlides.length > visibleSlides && (
                    <Button whileTap={{ scale: 0.95 }} left onClick={prevSlide} aria-label="Previous Slide">
                        <ArrowLeft />
                    </Button>
                )}
                {jsEnabled ? (
                    <StyledSlider className="keen-slider" ref={ref} visibleSlides={visibleSlides} spacing={spacing}>
                        {duplicatedSlides.map((slide, idx) => (
                            <StyledSlide column key={idx} className="keen-slider__slide" visibleSlides={visibleSlides}>
                                {slide}
                            </StyledSlide>
                        ))}
                    </StyledSlider>
                ) : (
                    // Convert numeric spacing to rem or another unit here:
                    <StyledNoJSSlider gap={spacing}>{duplicatedSlides}</StyledNoJSSlider>
                )}
                {jsEnabled && withArrows && duplicatedSlides.length > visibleSlides && (
                    <Button whileTap={{ scale: 0.95 }} onClick={nextSlide} aria-label="Next Slide">
                        <ArrowRight />
                    </Button>
                )}
            </Content>
            {jsEnabled && duplicatedSlides.length > 1 && withDots && (
                <DotsWrapper justifyCenter itemsCenter gap="1rem">
                    {slides.map((_, i) => (
                        <Dot key={i} active={i === currentSlide} onClick={() => goToSlide(i)} />
                    ))}
                </DotsWrapper>
            )}
        </Wrapper>
    );
};

// Styled Components

const DotsWrapper = styled(Stack)`
    margin-top: 3rem;
`;

const Dot = styled.div<{ active: boolean }>`
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: ${({ active }) => (active ? '#000' : '#ccc')};
    transition: background 0.3s ease;
    cursor: pointer;
`;

const Wrapper = styled(Stack)`
    width: 100%;
    overflow: hidden;
`;

const Content = styled(Stack)`
    position: relative;
    width: 100%;
    overflow: hidden;
`;

const Button = styled(motion.button)<{ left?: boolean }>`
    appearance: none;
    border: none;
    background: #f0f0f0;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ left }) => (left ? 'left: 0.5rem;' : 'right: 0.5rem;')}
    z-index: 1;

    transition: opacity 0.3s ease;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`;

const StyledNoJSSlider = styled.div<{ gap: number }>`
    display: flex;
    align-items: center;
    gap: ${({ gap }) => `${gap}rem`}; /* convert numeric gap to rem */
    overflow: hidden;
`;

const StyledSlider = styled(Stack)<{ visibleSlides: number; spacing: number }>`
    display: flex;
    transition: transform 0.5s ease-in-out;
    gap: ${({ spacing }) => `${spacing}rem`}; /* convert numeric spacing to rem */
    width: 100%;
`;

const StyledSlide = styled(Stack)<{ visibleSlides: number }>`
    flex: 0 0 ${({ visibleSlides }) => 100 / visibleSlides}%;
    box-sizing: border-box;
    padding: 0rem;
`;
