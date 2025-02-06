import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';
import { Divider, Stack } from '@/src/components';
import useIsMobile from '@/src/util/hooks/useIsMobile';
import { optimizeImage } from '@/src/util/optimizeImage';


const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ---------- Styled Components ----------

const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    background: #f0f0f0;
    user-select: none;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }

    @media (min-width: 1024px) {
        perspective: 2000px;
        min-height: 950px;
    }

    @media (max-width: 1023px) and (min-width: 769px) {
        perspective: 1200px;
        min-height: 700px;
    }

    @media (max-width: 768px) {
        perspective: 1000px;
        min-height: 613px;
    }
`;

const CarouselBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
`;

const SlidesWrapper = styled.div`
    position: relative;
    width: 100%;
    flex: 0 0 auto;

    @media (min-width: 1024px) {
        min-height: 750px;
    }
    @media (max-width: 1023px) and (min-width: 769px) {
        min-height: 600px;
    }
    @media (max-width: 768px) {
        min-height: 600px;
    }
    @media (max-width: 480px) {
        min-height: 300px;
    }
`;

const CenterAnchor = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    width: 0;
    height: 0;
`;

const SlideLink = styled.a<{ isHovered: boolean }>`
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;
    cursor: pointer;
    text-decoration: none;

    .flip-card-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        transform: ${({ isHovered }) =>
                isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)'};
    }

    .flip-card-front,
    .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 8px;
        transition: opacity 0.6s;
    }

    .flip-card-front {
        z-index: 2;
        opacity: ${({ isHovered }) => (isHovered ? 0 : 1)};
    }

    .flip-card-back {
        transform: rotateY(180deg);
        z-index: 1;
        opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
    }
`;

const ProductSlide = styled.div<{
    angle: number;
    distance: number;
    isActive: boolean;
    translateY: number;
    zIndex: number;
    height: number;
    opacity: number;
    flattened: boolean;
    index: number;
    activeIndex: number;
    extraLift: number;
    activeBoardScale: number;
}>`
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    border-radius: 8px;
    touch-action: pan-y;

    ${({ flattened, angle, distance, translateY, index, activeIndex, extraLift, activeBoardScale }) => {
        const distanceFromActive = Math.abs((index % 1000) - (activeIndex % 1000));

        if (flattened) {
            // For mobile "flattened" scenario
            const scale =
                    distanceFromActive === 0 ? activeBoardScale : Math.max(0.7, 1 - distanceFromActive * 0.1);
            const xShift = ((index % 1000) - (activeIndex % 1000)) * 120;
            const yShift = -Math.abs((index % 1000) - (activeIndex % 1000)) * extraLift;
            return `
          opacity: 1;
          transform:
              translate(-50%, -50%)
              translateX(${xShift}px)
              translateY(${yShift}px)
              scale(${scale});
      `;
        } else {
            // Non-flattened scenario: rotate in 3D plus scale & fade
            const scaleFactor = 1 - 0.08 * distanceFromActive;
            const clampedScale = scaleFactor < 0.4 ? 0.4 : scaleFactor;
            const fadeFactor = 1 - 0.15 * distanceFromActive;
            const clampedOpacity = fadeFactor < 0.1 ? 0.1 : fadeFactor;

            const finalScale = distanceFromActive === 0 ? activeBoardScale : clampedScale;

            return `
          opacity: ${clampedOpacity};
          transform:
              rotateY(${angle}deg)
              translateZ(${distance}px)
              translateY(${translateY}px)
              rotateY(${-angle}deg)
              translate(-50%, -50%)
              scale(${finalScale});
      `;
        }
    }}

    z-index: ${({ zIndex }) => zIndex};
`;

const ProductImageContainer = styled.div<{ height: number }>`
    width: 150px;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: contain;
    object-position: center center;
    overflow: hidden;
    transform-origin: center;
    position: relative;

    @media (max-width: 1023px) and (min-width: 769px) {
        width: 130px;
        height: 260px;
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 240px;
    }
`;

const BottomStackWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    width: 100%;
    max-width: 700px;
    padding: 0 1rem;
    box-sizing: border-box;
    z-index: 99;

    @media (max-width: 1023px) and (min-width: 769px) {
        margin: 2rem auto;
    }

    @media (max-width: 768px) {
        margin-top: 60px;
    }
`;

const BottomStack = styled(Stack)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
    width: 100%;
    @media (max-width: 767px) {
        padding: 0px 30px;
    }
`;

const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.01);
    padding: 20px 20px;
    border: 1px solid #4d4d4d;
    text-align: left;
    border-radius: 8px;
    width: 100%;
    max-width: 591px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 15px 20px;
        margin: 0px 60px;
    }
`;

const ProductTitle = styled.h3`
    display: flex;
    align-items: start;
    justify-content: left;
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    line-height: 16px;
    text-align: left;
    gap: 20px;

    & > b {
        font-size: 18px;
        font-weight: 700;
        line-height: 18px;
        text-align: center;
    }

    @media (max-width: 768px) {
        font-size: 14px;
        & > b {
            font-size: 16px;
        }
    }

    @media (max-width: 480px) {
        font-size: 12px;
        & > b {
            font-size: 14px;
        }
    }
`;

const ProductDetails = styled.div`
    z-index: 10;
    display: flex;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    gap: 20px;
    line-height: 15px;
    text-align: center;

    & > span > span {
        font-size: 15px;
        font-weight: 300;
        line-height: 15px;
        text-align: center;
    }

    @media (max-width: 768px) {
        font-size: 14px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
    }
`;

const StockButton = styled.button<{ inStock: boolean }>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ inStock, theme }) =>
            inStock ? theme.text.accentGreen : theme.text.accentGreen};
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    color: white;
    padding: 9px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 14px;
        padding: 7px 12px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
        padding: 5px 10px;
    }

    &:hover {
        color: white;
        background: ${({ theme }) => theme.background.accentGreen};
        transform: scale(1.03);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
`;

const Quote = styled(Stack)`
    margin-top: 30px;
    font-size: 24px;
    font-style: italic;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    margin-bottom: 20px;

    & > small {
        font-size: 20px !important;
        font-weight: 300 !important;
        line-height: 20px !important;
        text-align: center;
        display: block;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const RotateIconWrapper = styled.div`
    background: #cccccc;
    padding: 5px;
    border-radius: 50%;
`;

const FlipButtonContainer = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
`;

const ImageFlipContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;

    .flip-card-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }

    .flip-card-front,
    .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 8px;
    }

    .flip-card-back {
        transform: rotateY(180deg);
    }
`;

// ---------- Component ----------

export const CircularProductCarousel: React.FC<{
    products: any[];
    activeBoardScale?: number;
}> = ({ products, activeBoardScale = 1.2 }) => {
    const isMobile = useIsMobile();
    const productCount = products.length;
    const [displayCount, setDisplayCount] = useState<number>(Math.min(productCount, 11));
    const [activeIndex, setActiveIndex] = useState<number>(productCount);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [flipButtonTop, setFlipButtonTop] = useState<number>(0);

    const [rotationAngle, setRotationAngle] = useState<number>(360 / displayCount);
    const [carouselDistance, setCarouselDistance] = useState<number>(400);
    const [maxLiftAmount, setMaxLiftAmount] = useState<number>(200);
    const [extraLiftFlattened, setExtraLiftFlattened] = useState<number>(0);
    const [flattened, setFlattened] = useState(false);

    // Only the active board can be flipped.
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [forceFlipActive, setForceFlipActive] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const activeSlideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newDisplayCount: number;
            let newRotationAngle: number;
            let newCarouselDistance: number;
            let newFlattened: boolean;
            let newMaxLiftAmount: number;
            let newExtraLiftFlattened: number;

            if (width < 480) {
                newDisplayCount = Math.min(productCount, 5);
                newRotationAngle = 0; // flatten for very small screens
                newCarouselDistance = -100;
                newFlattened = true;
                newMaxLiftAmount = 50;
                newExtraLiftFlattened = 0;
            } else if (width < 768) {
                newDisplayCount = Math.min(productCount, 8);
                newRotationAngle = 360 / newDisplayCount;
                newCarouselDistance = 250;
                newFlattened = false;
                newMaxLiftAmount = 150;
                newExtraLiftFlattened = 0;
            } else if (width < 1024) {
                newDisplayCount = Math.min(productCount, 12);
                newRotationAngle = 360 / newDisplayCount;
                newCarouselDistance = 300;
                newFlattened = false;
                newMaxLiftAmount = 180;
                newExtraLiftFlattened = 0;
            } else {
                newDisplayCount = Math.min(productCount, 16);
                newRotationAngle = 360 / newDisplayCount;
                newCarouselDistance = 350;
                newFlattened = false;
                newMaxLiftAmount = 150;
                newExtraLiftFlattened = 0;
            }

            setDisplayCount(newDisplayCount);
            setRotationAngle(newRotationAngle);
            setCarouselDistance(newCarouselDistance);
            setFlattened(newFlattened);
            setMaxLiftAmount(newMaxLiftAmount);
            setExtraLiftFlattened(newExtraLiftFlattened);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [productCount]);

    const duplicatedProducts = [...products];

    // ---- Drag/Swipe Handling ----
    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setStartX(e.clientX);
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const distanceMoved = Math.abs(e.touches[0].clientX - startX);
        if (distanceMoved > 10) {
            setIsDragging(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) {
            const distanceMoved = Math.abs(e.clientX - startX);
            if (distanceMoved > 10) {
                setIsDragging(true);
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isDragging) {
            // It's effectively a tap => decide if left or right of active board
            handleContainerClick(e.changedTouches[0].clientX);
        } else {
            // It's a real swipe
            const moveX = e.changedTouches[0].clientX - startX;
            if (Math.abs(moveX) > 50) {
                if (moveX > 0) {
                    setActiveIndex((prevIndex) => prevIndex - 1);
                } else {
                    setActiveIndex((prevIndex) => prevIndex + 1);
                }
            }
        }
        setIsDragging(false);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) {
            handleContainerClick(e.clientX);
        } else {
            const moveX = e.clientX - startX;
            if (Math.abs(moveX) > 50) {
                if (moveX > 0) {
                    setActiveIndex((prevIndex) => prevIndex - 1);
                } else {
                    setActiveIndex((prevIndex) => prevIndex + 1);
                }
            }
        }
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Click outside the active board => move left or right
    const handleContainerClick = (clickX: number) => {
        if (!activeSlideRef.current) return;
        const activeRect = activeSlideRef.current.getBoundingClientRect();

        if (clickX < activeRect.left) {
            setActiveIndex((prev) => prev - 1);
        } else if (clickX > activeRect.right) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    // Wrap indexes to avoid going out of array bounds
    const wrappedIndex = (index: number) => {
        if (index >= duplicatedProducts.length) return index % productCount;
        else if (index < 0) return (index + productCount) % productCount;
        return index;
    };

    useEffect(() => {
        setActiveIndex((current) => wrappedIndex(current));
    }, [activeIndex, productCount, duplicatedProducts]);

    // Dynamically calculate the flip button’s top position relative to the carousel container.
    useIsomorphicLayoutEffect(() => {
        const updateFlipButtonPosition = () => {
            if (activeSlideRef.current && containerRef.current) {
                const activeRect = activeSlideRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                setFlipButtonTop(activeRect.bottom - containerRect.top + 10);
            }
        };

        updateFlipButtonPosition();
        window.addEventListener('resize', updateFlipButtonPosition);
        return () => window.removeEventListener('resize', updateFlipButtonPosition);
    }, [activeIndex, isMobile, flattened, carouselDistance, maxLiftAmount, extraLiftFlattened]);

    const modActiveIndex = activeIndex % productCount;
    const currentProduct = products[modActiveIndex];

    return (
        <CarouselContainer
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Critical Background Image */}
            <CarouselBackground>
                <Image
                    src="/images/bg/homecarousel.jpeg"
                    alt="Carousel Background"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.2 }}
                    priority
                />
            </CarouselBackground>

            <SlidesWrapper>
                <CenterAnchor>
                    {duplicatedProducts.map((product, index) => {
                        const effectiveIndex = index % productCount;
                        // Only apply lazy rendering on mobile
                        if (isMobile) {
                            const diff = Math.min(
                                Math.abs(effectiveIndex - modActiveIndex),
                                productCount - Math.abs(effectiveIndex - modActiveIndex)
                            );
                            if (diff > 2) return null;
                        }

                        const angle = rotationAngle * (effectiveIndex - modActiveIndex);
                        const isActive = effectiveIndex === modActiveIndex;
                        const cosAngle = Math.cos((angle * Math.PI) / 180);
                        const translateY = flattened ? 0 : cosAngle * maxLiftAmount;
                        const zIndex = flattened ? 1 : Math.round(cosAngle * 1000);

                        const minHeight = 159.35;
                        const maxHeight = 356.2;
                        const height = flattened
                            ? 200
                            : minHeight + (maxHeight - minHeight) * ((cosAngle + 1) / 2);

                        const frontPhoto =
                            product?.customFields?.variants?.[0]?.frontPhoto?.source ||
                            product.productAsset?.preview;
                        const backPhoto =
                            product?.customFields?.variants?.[0]?.backPhoto?.source;

                        const isHoveredOrFlipped =
                            isActive &&
                            ((!isMobile && index === hoveredIndex) || (isMobile && forceFlipActive));

                        const SlideContent = (
                            <ProductImageContainer height={height}>
                                {backPhoto ? (
                                    <ImageFlipContainer>
                                        <div
                                            className="flip-card-inner"
                                            style={{
                                                transform: isHoveredOrFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}
                                        >
                                            <img
                                                className="flip-card-front"
                                                src={optimizeImage({ size: 'noresize', src: frontPhoto })}
                                                alt={product.productName}
                                                draggable={false}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    backfaceVisibility: 'hidden',
                                                }}
                                            />
                                            <img
                                                className="flip-card-back"
                                                src={optimizeImage({ size: 'noresize', src: backPhoto })}
                                                alt={`${product.productName} Back`}
                                                draggable={false}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                }}
                                            />
                                        </div>
                                    </ImageFlipContainer>
                                ) : (
                                    <img
                                        src={optimizeImage({ size: 'noresize', src: frontPhoto })}
                                        alt={product.productName}
                                        draggable={false}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '8px',
                                        }}
                                    />
                                )}
                            </ProductImageContainer>
                        );

                        return (
                            <ProductSlide
                                key={index}
                                angle={angle}
                                distance={carouselDistance}
                                isActive={isActive}
                                translateY={translateY}
                                zIndex={zIndex}
                                height={height}
                                opacity={1}
                                flattened={flattened}
                                index={index}
                                activeIndex={activeIndex}
                                extraLift={extraLiftFlattened}
                                activeBoardScale={activeBoardScale}
                                ref={isActive ? activeSlideRef : null}
                            >
                                {isActive ? (
                                    !isMobile ? (
                                        <SlideLink
                                            href={`/snowboards/${product.slug}`}
                                            aria-label={`View details for ${product.productName}`}
                                            isHovered={isHoveredOrFlipped}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            onFocus={() => setHoveredIndex(index)}
                                            onBlur={() => setHoveredIndex(null)}
                                            onDragStart={(e) => e.preventDefault()}
                                        >
                                            {SlideContent}
                                        </SlideLink>
                                    ) : (
                                        <SlideLink
                                            aria-label={`View details for ${product.productName}`}
                                            isHovered={isHoveredOrFlipped}
                                            onDragStart={(e) => e.preventDefault()}
                                        >
                                            {SlideContent}
                                        </SlideLink>
                                    )
                                ) : (
                                    <div
                                        style={{ width: '100%', height: '100%' }}
                                        onDragStart={(e) => e.preventDefault()}
                                        tabIndex={0}
                                    >
                                        {SlideContent}
                                    </div>
                                )}
                            </ProductSlide>
                        );
                    })}
                </CenterAnchor>
            </SlidesWrapper>

            {isMobile && (
                <FlipButtonContainer style={{ top: flipButtonTop }}>
                    <button onClick={() => setForceFlipActive((prev) => !prev)}>
                        <RotateIconWrapper>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                style={{ width: '24px', height: '24px' }}
                            >
                                <path
                                    d="M14.9,12.6l5.2,2-2.5,4.1"
                                    style={{
                                        fill: 'none',
                                        stroke: '#000',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        strokeWidth: '2px',
                                    }}
                                />
                                <path
                                    d="M18.5,14.9c-1.7,0.9-4,1.4-6.5,1.4-5.2,0-9.3-2.2-9.3-5s4.2-5,9.3-5,8.3,1.7,9.2,4"
                                    style={{
                                        fill: 'none',
                                        stroke: '#000',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        strokeWidth: '2px',
                                    }}
                                />
                            </svg>
                        </RotateIconWrapper>
                    </button>
                </FlipButtonContainer>
            )}

            <BottomStackWrapper>
                <BottomStack column>
                    <InfoBlock>
                        <Stack justifyBetween itemsCenter>
                            <ProductTitle>
                                <b>{currentProduct?.customFields?.brand}</b>
                                {currentProduct?.productName}
                            </ProductTitle>
                            <Link href={`/snowboards/${currentProduct?.slug}`} passHref>
                                <StockButton as="a" inStock={currentProduct?.inStock}>
                                    {currentProduct?.inStock ? 'More info' : 'Read more'}
                                </StockButton>
                            </Link>
                        </Stack>
                        <Divider marginBlock="1.5rem" />
                        <Stack gap={26}>
                            <ProductDetails>
                                <span>
                                  Price:{' '}
                                    <span className="amount">
                                    &euro;{(currentProduct?.priceWithTax?.min / 100).toFixed(2)}
                                  </span>
                                </span>
                                {currentProduct?.terrain && (
                                    <span>
                                        Terrain: <span>{currentProduct?.terrain}</span>
                                    </span>
                                )}
                                {currentProduct?.level && (
                                    <span>
                                        Rider Level: <span>{currentProduct?.level}</span>
                                    </span>
                                )}
                            </ProductDetails>
                        </Stack>
                    </InfoBlock>
                    {currentProduct?.customFields?.quote && (
                        <Quote justifyCenter column>
                            {currentProduct.customFields.quote}
                            <small>{currentProduct.customFields.quoteOwner}</small>
                        </Quote>
                    )}
                </BottomStack>
            </BottomStackWrapper>
        </CarouselContainer>
    );
};
