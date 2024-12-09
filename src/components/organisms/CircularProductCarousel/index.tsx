import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Divider, Stack } from '@/src/components';

const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    background: #f0f0f0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

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
        perspective: 2000px;
        min-height: 950px;
    }

    @media (max-width: 1023px) and (min-width: 769px) {
        perspective: 1200px;
        min-height: 700px;
    }

    @media (max-width: 768px) {
        perspective: 1000px;
        min-height: 600px;
    }

    @media (max-width: 480px) {
        perspective: 300px;
        min-height: 500px;
    }
`;

const SlidesWrapper = styled.div`
    position: relative;
    width: 100%;
    flex: 0 0 auto;
    @media (min-width: 1024px) {
        min-height: 950px;
    }
    @media (max-width: 1023px) and (min-width: 769px) {
        min-height: 700px;
    }
    @media (max-width: 768px) {
        min-height: 600px;
    }
    @media (max-width: 480px) {
        min-height: 500px;
    }
`;

// Center anchor to ensure the carousel rotates around a known center
const CenterAnchor = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    width: 0;
    height: 0;
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
}>`
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: ${({ opacity }) => opacity};
    border-radius: 8px;

    ${({ flattened, angle, distance, translateY, index, activeIndex, extraLift }) =>
            flattened
                    ? `
                transform:
                  translateX(${(index - activeIndex) * 120}px)
                  translateY(${-Math.abs(index - activeIndex) * extraLift}px)
                  translate(-50%, -50%);
            `
                    : `
                transform:
                  rotateY(${angle}deg)
                  translateZ(${distance}px)
                  translateY(${translateY}px)
                  rotateY(${-angle}deg)
                  translate(-50%, -50%);
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

const BottomStackWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    width: 100%;
    max-width: 700px;
    padding: 0 1rem;
    box-sizing: border-box;
`;

const BottomStack = styled(Stack)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
    width: 100%;
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
    const productCount = products.length;
    const [displayCount, setDisplayCount] = useState<number>(Math.min(productCount, 11));
    const [activeIndex, setActiveIndex] = useState(productCount);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const [rotationAngle, setRotationAngle] = useState<number>(360 / displayCount);
    const [carouselDistance, setCarouselDistance] = useState<number>(400);

    const [maxLiftAmount, setMaxLiftAmount] = useState<number>(200);
    const [extraLiftFlattened, setExtraLiftFlattened] = useState<number>(0);

    const [flattened, setFlattened] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newDisplayCount;
            if (width < 480) {
                newDisplayCount = Math.min(productCount, 5);
                setRotationAngle(0);
                setCarouselDistance(0);
                setFlattened(true);
                setMaxLiftAmount(50);
                setExtraLiftFlattened(10);
            } else if (width < 768) {
                newDisplayCount = Math.min(productCount, 8);
                setRotationAngle(360 / newDisplayCount);
                setCarouselDistance(250);
                setFlattened(false);
                setMaxLiftAmount(150);
                setExtraLiftFlattened(0);
            } else {
                newDisplayCount = Math.min(productCount, 16);
                setRotationAngle(360 / newDisplayCount);
                setCarouselDistance(400);
                setFlattened(false);
                setMaxLiftAmount(200);
                setExtraLiftFlattened(0);
            }
            setDisplayCount(newDisplayCount);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [productCount]);

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
        handleSwipeMove(e.touches[0].clientX);
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
        if (index >= duplicatedProducts.length) return productCount;
        else if (index < 0) return duplicatedProducts.length - productCount;
        return index;
    };

    useEffect(() => setActiveIndex((current) => wrappedIndex(current)), [activeIndex, productCount, duplicatedProducts]);

    const currentProduct = products[activeIndex % productCount];

    return (
        <CarouselContainer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <SlidesWrapper>
                <CenterAnchor>
                    {duplicatedProducts.map((product, index) => {
                        const angle = rotationAngle * (index - activeIndex);
                        const isActive = index === activeIndex;
                        const cosAngle = Math.cos((angle * Math.PI) / 180);
                        const translateY = flattened ? 0 : cosAngle * maxLiftAmount;
                        const zIndex = flattened ? 1 : cosAngle * 1000;

                        const minHeight = 159.35;
                        const maxHeight = 356.2;
                        const height = flattened
                            ? 200
                            : minHeight + (maxHeight - minHeight) * ((cosAngle + 1) / 2);

                        const opacity = flattened
                            ? 1
                            : isActive
                                ? 1
                                : 0.4 + (0.5 * (1 - Math.abs(cosAngle)));

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
                                extraLift={extraLiftFlattened}
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
                </CenterAnchor>
            </SlidesWrapper>

            <BottomStackWrapper>
                <BottomStack column>
                    <Quote justifyCenter column>
                        “By far the best freeride board that I have ever ridden.”
                        <small>- Jasper Bazuin</small>
                    </Quote>

                    <InfoBlock>
                        <Stack justifyBetween itemsCenter>
                            <ProductTitle>
                                <b>{currentProduct?.customFields?.brand}</b>
                                {currentProduct?.productName} ({currentProduct?.productVariantName})
                            </ProductTitle>
                            <Link href={`/products/${currentProduct?.slug}`} passHref>
                                <StockButton inStock={currentProduct?.inStock}>
                                    {currentProduct?.inStock ? 'In Stock' : 'Out of Stock'}
                                </StockButton>
                            </Link>
                        </Stack>
                        <Divider marginBlock="1.5rem" />
                        <Stack gap={26}>
                            <ProductDetails>
                                <span>
                                    Price: <span className="amount">
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
                </BottomStack>
            </BottomStackWrapper>
        </CarouselContainer>
    );
};
