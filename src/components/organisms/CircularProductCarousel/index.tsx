import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Divider, Stack } from '@/src/components';

const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f0f0f0;
    padding-top: 100px; /* More distance from top on desktop */

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

    @media (min-width: 1024px) {
        perspective: 2000px; /* Strong perspective on larger screens */
        height: 950px;
    }

    @media (max-width: 1023px) and (min-width: 769px) {
        height: 700px; /* Tablet: a bit more compact height */
        perspective: 1200px;
    }

    @media (max-width: 768px) {
        height: 600px;
        perspective: 1000px;
    }

    @media (max-width: 480px) {
        height: 500px;
        perspective: 300px; /* On mobile, perspective low (though rotation is off) */
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
}>`
    position: absolute;
    left: 50%;
    top: ${({ flattened }) => (flattened ? '45%' : '30%')};
    transform-style: preserve-3d;
    transform-origin: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: ${({ opacity }) => opacity};
    border-radius: 8px;

    ${({ flattened, angle, distance, translateY, index, activeIndex }) =>
            flattened
                    ? `
                /* Mobile flat slider: no rotation, just horizontal translate.
                   Also, add a subtle vertical lift depending on how far from center they are */
                transform: translateX(${(index - activeIndex) * 120}px) translate(-50%, -50%) translateY(${-(Math.abs(index - activeIndex) * 30)}px);
            `
                    : `
                /* Desktop/Tablet 3D effect */
                transform: 
                  rotateY(${angle}deg)
                  translateZ(${distance}px)
                  translateY(${translateY}px)
                  translate(-50%, -50%)
                  rotateY(${-angle}deg);
            `
    }

    z-index: ${({ zIndex }) => zIndex};
`;

const ProductImageContainer = styled.div<{ height: number }>`
    width: 150px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: contain;
    object-position: center center;
    overflow: hidden;
    transform-origin: center;

    @media (max-width: 1023px) and (min-width: 769px) {
        /* Tablet: a bit smaller */
        width: 130px;
        height: 260px;
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 240px;
    }

    @media (max-width: 480px) {
        width: 90px;
        height: 180px;
    }
`;

const BottomStackWrapper = styled(Stack)`
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    bottom: 72px;
    width: 100%;
    @media (max-width: 768px) {
        bottom: 50px;
    }

    @media (max-width: 480px) {
        bottom: 30px;
    }
`;

const BottomStack = styled(Stack)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    text-align: left;

    @media (max-width: 768px) {
        width: 90%;
    }

    @media (max-width: 480px) {
        width: 95%;
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

    @media (max-width: 768px) {
        padding: 15px;
    }

    @media (max-width: 480px) {
        padding: 10px;
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
        font-size: 20px;
        & > small {
            font-size: 18px !important;
        }
    }

    @media (max-width: 480px) {
        font-size: 18px;
        & > small {
            font-size: 16px !important;
        }
    }
`;

export const CircularProductCarousel: React.FC<{ products: any[] }> = ({ products }) => {
    const [activeIndex, setActiveIndex] = useState(products.length);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const [rotationAngle, setRotationAngle] = useState<number>(360 / products.length);
    const [carouselDistance, setCarouselDistance] = useState<number>(400);
    const maxLiftAmount = 200;
    const minHeight = 159.35;
    const maxHeight = 356.2;

    const [flattened, setFlattened] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 480) {
                // Mobile: flat slider, no rotation
                setRotationAngle(0);
                setCarouselDistance(0);
                setFlattened(true);
            } else if (width < 768) {
                // Tablet: slightly less distance for a more compact feel
                setRotationAngle(360 / products.length);
                setCarouselDistance(250);
                setFlattened(false);
            } else {
                // Desktop
                setRotationAngle(360 / products.length);
                setCarouselDistance(400);
                setFlattened(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [products.length]);

    const duplicatedProducts = [...products, ...products];

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touchX = e.touches[0].clientX;
        handleSwipeMove(touchX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleSwipeMove(e.clientX);
    };

    const handleSwipeMove = (currentX: number) => {
        const moveX = currentX - startX;
        if (moveX > 50) {
            setActiveIndex((prevIndex) => prevIndex - 1);
            setIsDragging(false);
        } else if (moveX < -50) {
            setActiveIndex((prevIndex) => prevIndex + 1);
            setIsDragging(false);
        }
    };

    const handleTouchEnd = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const wrappedIndex = (index: number) => {
        if (index >= duplicatedProducts.length) return products.length;
        else if (index < 0) return duplicatedProducts.length - products.length;
        return index;
    };

    useEffect(() => setActiveIndex((current) => wrappedIndex(current)), [activeIndex]);

    return (
        <CarouselContainer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {duplicatedProducts.map((product, index) => {
                const angle = rotationAngle * (index - activeIndex);
                const isActive = index === activeIndex;
                const translateY = flattened ? 0 : Math.cos((angle * Math.PI) / 180) * maxLiftAmount;
                const zIndex = flattened ? 1 : Math.cos((angle * Math.PI) / 180) * 1000;
                const height = flattened
                    ? 200
                    : minHeight + (maxHeight - minHeight) * ((Math.cos((angle * Math.PI) / 180) + 1) / 2);
                const opacity = flattened
                    ? 1 // All visible and opaque on mobile for simplicity
                    : isActive
                        ? 1
                        : 0.4 + (0.5 * (1 - Math.abs(Math.cos((angle * Math.PI) / 180))));

                return (
                    <ProductSlide
                        key={index}
                        angle={angle}
                        distance={carouselDistance}
                        isActive={isActive}
                        translateY={translateY}
                        zIndex={Math.round(zIndex)}
                        height={height}
                        opacity={opacity}
                        flattened={flattened}
                        index={index}
                        activeIndex={activeIndex}
                    >
                        <ProductImageContainer height={height}>
                            <img
                                src={product.productAsset?.preview}
                                alt={product.productName}
                                draggable={false}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                        </ProductImageContainer>
                    </ProductSlide>
                );
            })}

            <BottomStackWrapper>
                <BottomStack column>
                    <Quote justifyCenter column>
                        “By far the best freeride board that I have ever ridden.”
                        <small>- Jasper Bazuin</small>
                    </Quote>

                    <InfoBlock>
                        <Stack justifyBetween itemsCenter>
                            <ProductTitle>
                                <b>{products[activeIndex % products.length]?.customFields?.brand}</b>
                                {products[activeIndex % products.length]?.productName} ({products[activeIndex % products.length]?.productVariantName})
                            </ProductTitle>
                            <Link
                                href={`/products/${products[activeIndex % products.length]?.slug}`}
                                passHref
                            >
                                <StockButton inStock={products[activeIndex % products.length]?.inStock}>
                                    {products[activeIndex % products.length]?.inStock ? 'In Stock' : 'Out of Stock'}
                                </StockButton>
                            </Link>
                        </Stack>
                        <Divider marginBlock="1.5rem" />
                        <Stack gap={26}>
                            <ProductDetails>
                                <span>
                                    Price: <span className="amount">
                                    &euro;{(products[activeIndex % products.length]?.priceWithTax?.min / 100).toFixed(2)}
                                    </span>
                                </span>
                                {products[activeIndex % products.length]?.terrain && (
                                    <span>
                                        Terrain: <span>{products[activeIndex % products.length]?.terrain}</span>
                                    </span>
                                )}
                                {products[activeIndex % products.length]?.level && (
                                    <span>
                                        Rider Level: <span>{products[activeIndex % products.length]?.level}</span>
                                    </span>
                                )}
                            </ProductDetails>
                        </Stack>
                    </InfoBlock>
                </BottomStack>
            </BottomStackWrapper>
        </CarouselContainer>
    );
};
