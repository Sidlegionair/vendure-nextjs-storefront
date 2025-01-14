import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Divider, Stack } from '@/src/components';
import useIsMobile from '@/src/util/hooks/useIsMobile';

// Styled Components (unchanged)

const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    background: #f0f0f0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    user-select: none; /* Prevent text/image selection */
    cursor: grab; /* Indicate draggable area */

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('/images/bg/homecarousel.jpeg') no-repeat center center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1;
    }

    &:active {
        cursor: grabbing; /* Change cursor when active */
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

// SlideLink Component (unchanged)

const SlideLink = styled.a<{ isHovered: boolean }>`
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;
    cursor: pointer;
    text-decoration: none; /* Remove underline */

    .flip-card-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        transform: ${({ isHovered }) => (isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)')};
    }

    .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 8px;
        transition: opacity 0.6s;
    }

    .flip-card-front {
        z-index: 2; /* Front image above when not flipped */
        opacity: ${({ isHovered }) => (isHovered ? 0 : 1)};
    }

    .flip-card-back {
        transform: rotateY(180deg);
        z-index: 1; /* Back image below when not flipped */
        opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
    }
`;

// ProductSlide Component (unchanged)

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
}>`
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    border-radius: 8px;
    touch-action: pan-y; /* Allow vertical scrolling on touch devices */

    ${({ flattened, angle, distance, translateY, index, activeIndex, extraLift }) => {
        const distanceFromActive = Math.abs((index % 1000) - (activeIndex % 1000));

        if (flattened) {
            const scale = distanceFromActive === 0 ? 1.3 : Math.max(0.7, 1 - distanceFromActive * 0.1);
            const xShift = ((index % 1000) - (activeIndex % 1000)) * 120;
            const yShift = -Math.abs(((index % 1000) - (activeIndex % 1000))) * extraLift;

            return `
                opacity: 1;
                transform:
                    translate(-50%, -50%)
                    translateX(${xShift}px)
                    translateY(${yShift}px)
                    scale(${scale});
            `;
        } else {
            return `
                opacity: 1;
                transform:
                    rotateY(${angle}deg)
                    translateZ(${distance}px)
                    translateY(${translateY}px)
                    rotateY(${-angle}deg)
                    translate(-50%, -50%);
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
    position: relative; /* For positioning flip elements */

    @media (max-width: 1023px) and (min-width: 769px) {
        width: 130px;
        height: 260px;
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 240px;
    }
`;

// Bottom Stack Styles (unchanged)

const BottomStackWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    width: 100%;
    max-width: 700px;
    padding: 0 1rem;
    box-sizing: border-box;

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
    @media(max-width: 767px) {
        padding: 0px 30px;
    }
`;

const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.01);
    padding: 20px 20px;
    border: 1px solid #4D4D4D;
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
            inStock ? theme.text.accentGreen : theme.text.accent};
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

// ImageFlipContainer Component (unchanged)

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

    .flip-card-front, .flip-card-back {
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

// CircularProductCarousel Component

export const CircularProductCarousel: React.FC<{ products: any[] }> = ({ products }) => {
    const isMobile = useIsMobile(); // Use the isMobile hook
    const productCount = products.length;
    const [displayCount, setDisplayCount] = useState<number>(Math.min(productCount, 11));
    const [activeIndex, setActiveIndex] = useState<number>(productCount);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const [rotationAngle, setRotationAngle] = useState<number>(360 / displayCount);
    const [carouselDistance, setCarouselDistance] = useState<number>(400);

    const [maxLiftAmount, setMaxLiftAmount] = useState<number>(200);
    const [extraLiftFlattened, setExtraLiftFlattened] = useState<number>(0);

    const [flattened, setFlattened] = useState(false);

    // New State for Hover Detection
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Ref to track dragging state for smoother updates
    const containerRef = useRef<HTMLDivElement>(null);

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
                newRotationAngle = 0;
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
                newCarouselDistance = 400;
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

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent image selection
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleSwipeMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleSwipeMove(e.clientX);
    };

    const handleSwipeMove = (currentX: number) => {
        const moveX = currentX - startX;
        // Implement smoother swipe detection
        if (Math.abs(moveX) > 50) {
            if (moveX > 0) {
                setActiveIndex((prevIndex) => prevIndex - 1);
            } else {
                setActiveIndex((prevIndex) => prevIndex + 1);
            }
            setIsDragging(false);
        }
    };

    const handleTouchEnd = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false); // Handle case when mouse leaves the container

    const wrappedIndex = (index: number) => {
        if (index >= duplicatedProducts.length) return index % productCount;
        else if (index < 0) return (index + productCount) % productCount;
        return index;
    };

    useEffect(() => {
        setActiveIndex((current) => wrappedIndex(current));
    }, [activeIndex, productCount, duplicatedProducts]);

    const modActiveIndex = activeIndex % productCount;
    const currentProduct = products[modActiveIndex];

    // Handle click on mobile to toggle flip
    const handleSlideClick = (index: number) => {
        setHoveredIndex((prev) => (prev === index ? null : index));
    };

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
            <SlidesWrapper>
                <CenterAnchor>
                    {duplicatedProducts.map((product, index) => {
                        const angle = rotationAngle * ((index % productCount) - modActiveIndex);
                        const isActive = (index % productCount) === modActiveIndex;
                        const cosAngle = Math.cos((angle * Math.PI) / 180);
                        const translateY = flattened ? 0 : cosAngle * maxLiftAmount;
                        const zIndex = flattened ? 1 : Math.round(cosAngle * 1000);

                        const minHeight = 159.35;
                        const maxHeight = 356.2;
                        const height = flattened
                            ? 200
                            : minHeight + (maxHeight - minHeight) * ((cosAngle + 1) / 2);

                        const frontPhoto = product?.customFields?.variants?.[0]?.frontPhoto?.source || product.productAsset?.preview;
                        const backPhoto = product?.customFields?.variants?.[0]?.backPhoto?.source;

                        // Slide Content with Enhanced Flip Effect
                        const SlideContent = (
                            <ProductImageContainer height={height}>
                                {isActive && backPhoto ? (
                                    <ImageFlipContainer>
                                        <div className="flip-card-inner">
                                            <img
                                                className="flip-card-front"
                                                src={frontPhoto}
                                                alt={product.productName}
                                                draggable={false}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                            <img
                                                className="flip-card-back"
                                                src={backPhoto}
                                                alt={`${product.productName} Back`}
                                                draggable={false}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </div>
                                    </ImageFlipContainer>
                                ) : (
                                    <img
                                        src={frontPhoto}
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

                        // Determine if the current slide is hovered
                        const isHovered = hoveredIndex === index;

                        return (
                            <ProductSlide
                                key={index}
                                angle={angle}
                                distance={carouselDistance}
                                isActive={isActive}
                                translateY={translateY}
                                zIndex={zIndex}
                                height={height}
                                opacity={1} // All slides have full opacity
                                flattened={flattened}
                                index={index}
                                activeIndex={activeIndex}
                                extraLift={extraLiftFlattened}
                            >
                                {isActive ? (
                                    !isMobile ? (
                                        <SlideLink
                                            href={`/snowboards/${product.slug}`}
                                            aria-label={`View details for ${product.productName}`}
                                            isHovered={isHovered}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            onFocus={() => setHoveredIndex(index)} // Accessibility: Handle focus
                                            onBlur={() => setHoveredIndex(null)}   // Accessibility: Handle blur
                                            onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
                                        >
                                            {SlideContent}
                                        </SlideLink>
                                    ) : (
                                        <SlideLink
                                            // href={`/snowboards/${product.slug}`}
                                            aria-label={`View details for ${product.productName}`}
                                            isHovered={isHovered}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            onFocus={() => setHoveredIndex(index)} // Accessibility: Handle focus
                                            onBlur={() => setHoveredIndex(null)}   // Accessibility: Handle blur
                                            onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
                                        >
                                            {SlideContent}
                                        </SlideLink>
                                    )
                                ) : (
                                    <div
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onFocus={() => setHoveredIndex(index)} // Accessibility: Handle focus
                                        onBlur={() => setHoveredIndex(null)}   // Accessibility: Handle blur
                                        style={{ width: '100%', height: '100%' }}
                                        tabIndex={0} // Make div focusable for accessibility
                                        onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
                                    >
                                        {SlideContent}
                                    </div>
                                )}
                            </ProductSlide>
                        );
                    })}
                </CenterAnchor>
            </SlidesWrapper>

            <BottomStackWrapper>
                <BottomStack column>

                    <InfoBlock>
                        <Stack justifyBetween itemsCenter>
                            <ProductTitle>
                                <b>{currentProduct?.customFields?.brand}</b>
                                {currentProduct?.productName} ({currentProduct?.productVariantName})
                            </ProductTitle>
                            <Link href={`/snowboards/${currentProduct?.slug}`} passHref>
                                <StockButton as="a" inStock={currentProduct?.inStock}>
                                    {currentProduct?.inStock ? 'In Stock' : 'Out of Stock'}
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
                    <Quote justifyCenter column>
                        “By far the best freeride board that I have ever ridden.”
                        <small>- Jasper Bazuin</small>
                    </Quote>

                </BottomStack>
            </BottomStackWrapper>
        </CarouselContainer>
    );
};
