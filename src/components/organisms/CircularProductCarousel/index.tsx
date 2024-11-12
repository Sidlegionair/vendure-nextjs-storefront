import React, { useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Divider, Stack } from '@/src/components';

const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 950px;
    width: 100%;
    perspective: 2000px;
    overflow: hidden;
    background: #f0f0f0;

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

    @media (max-width: 768px) {
        height: 600px;
    }

    @media (max-width: 480px) {
        height: 450px;
    }
`;

const ProductSlide = styled.div<{ angle: number; distance: number; isActive: boolean; translateY: number; zIndex: number; height: number; opacity: number }>`
    position: absolute;
    top: 30%;
    left: 50%;
    transform-style: preserve-3d;
    transform-origin: center;
    transform: ${({ angle, distance, translateY }) => `
        rotateY(${angle}deg)
        translateZ(${distance}px)
        translateY(${translateY}px)
        translate(-50%, -50%)
        rotateY(${-angle}deg)
    `};
    z-index: ${({ zIndex }) => zIndex};
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: ${({ opacity }) => opacity};
    box-shadow: ${({ isActive }) => (isActive ? '0px 4px 12px rgba(0, 0, 0, 0.3)' : 'none')};
    border-radius: 8px;

    @media (max-width: 768px) {
        top: 40%;
        transform: ${({ angle, distance, translateY }) => `
            rotateY(${angle}deg)
            translateZ(${distance * 0.8}px)
            translateY(${translateY * 0.8}px)
            translate(-50%, -50%)
            rotateY(${-angle}deg)
        `};
    }

    @media (max-width: 480px) {
        top: 50%;
        transform: ${({ angle, distance, translateY }) => `
            rotateY(${angle}deg)
            translateZ(${distance * 0.6}px)
            translateY(${translateY * 0.6}px)
            translate(-50%, -50%)
            rotateY(${-angle}deg)
        `};
    }
`;


const ProductImageContainer = styled.div<{ height: number }>`
    width: 150px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    object-position: center center;
    overflow: hidden;
    transform-origin: center;

    @media (max-width: 768px) {
        width: 120px;
        height: 240px;
    }

    @media (max-width: 480px) {
        width: 100px;
        height: 200px;
    }
`;

const InfoBlock = styled.div`
    height: 120px;
    background: rgba(255, 255, 255, 0.01);
    padding: 15px 20px;
    border: 1px solid #4D4D4D;
    text-align: center;
    border-radius: 8px;

    @media (max-width: 768px) {
        height: 100px;
        padding: 10px 15px;
    }

    @media (max-width: 480px) {
        height: 90px;
        padding: 8px 10px;
    }
`;

const ProductTitle = styled.h3`
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    line-height: 16px;
    text-align: left;

    & > b {
        font-size: 18px;
        font-weight: 700;
        line-height: 18px;
        text-align: left;
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
    justify-content: space-between;
    font-size: 15px;
    font-weight: 600;
    line-height: 15px;
    text-align: left;

    & > span > span {
        font-size: 15px;
        font-weight: 300;
        line-height: 15px;
        text-align: left;

    }
`;

const StockButton = styled.button<{ inStock: boolean }>`
    display: flex;
    justify-content: space-between;
    width: 108px;
    align-items: center;
    background-color: ${({ inStock, theme }) =>
    inStock ? theme.text.accentGreen : theme.text.accent};
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    text-align: left;
    color: white;
    padding: 9px 15px;
    border: none;
    border-radius: 6px;

    @media (max-width: 768px) {
        font-size: 14px;
        padding: 7px 12px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
        padding: 5px 10px;
    }
`;

// Responsive adjustments for the quote section
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

const BottomStack = styled(Stack)`
    position: absolute;
    bottom: 72px;
    width: 591px;

    @media (max-width: 768px) {
        width: 80%;
        bottom: 50px;
    }

    @media (max-width: 480px) {
        width: 90%;
        bottom: 30px;
    }
`;

export const CircularProductCarousel: React.FC<{ products: any[] }> = ({ products }) => {
    const [activeIndex, setActiveIndex] = useState(products.length);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const rotationAngle = 360 / products.length;
    const distance = 500;
    const maxLiftAmount = 150;

    const minHeight = 159.35;
    const maxHeight = 356.2;

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

    React.useEffect(() => setActiveIndex((current) => wrappedIndex(current)), [activeIndex]);

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
                const translateY = Math.cos((angle * Math.PI) / 180) * maxLiftAmount;
                const zIndex = Math.cos((angle * Math.PI) / 180) * 1000;
                const height = minHeight + (maxHeight - minHeight) * (Math.cos((angle * Math.PI) / 180) + 1) / 2;
                const opacity = isActive ? 1 : 0.4 + (0.5 * (1 - Math.abs(Math.cos((angle * Math.PI) / 180))));

                return (
                    <ProductSlide
                        angle={angle}
                        distance={distance}
                        isActive={isActive}
                        translateY={translateY}
                        zIndex={Math.round(zIndex)}
                        height={height}
                        opacity={opacity}
                    >
                        <ProductImageContainer height={height}>
                            <img
                                src={product.productAsset.preview}
                                alt={product.productName}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </ProductImageContainer>
                    </ProductSlide>
                );
            })}


            <BottomStack column>
                <Quote justifyCenter column>
                    “By far the best freeride board that I have ever ridden.”
                    <small>- Jasper Bazuin</small>
                </Quote>

                <InfoBlock>
                    <Stack justifyBetween itemsCenter>
                        <ProductTitle>
                            <b>{products[activeIndex % products.length]?.brand}</b>
                            {products[activeIndex % products.length]?.productName} ({products[activeIndex % products.length]?.productVariantName})
                        </ProductTitle>
                        <Link style={{ 'width': '100%', 'height': '100%', 'display': 'flex', 'justify-content': 'end' }} href={`/products/${products[activeIndex % products.length]?.slug}`} passHref key={`${products[activeIndex % products.length]?.slug}-${products[activeIndex % products.length]?.index}`}>

                            <StockButton inStock={products[activeIndex % products.length]?.inStock}>
                                {products[activeIndex % products.length]?.inStock ? 'In Stock' : 'Out of Stock'}
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.75083 9.88741C6.67911 9.81522 6.63882 9.71737 6.63882 9.61534C6.63882 9.51332 6.67911 9.41546 6.75083 9.34328L10.6924 5.38037L0.382989 5.38037C0.281414 5.38037 0.183999 5.3398 0.112174 5.2676C0.0403497 5.1954 -1.17649e-06 5.09748 -1.17203e-06 4.99537C-1.16757e-06 4.89326 0.0403498 4.79533 0.112174 4.72313C0.183999 4.65093 0.281414 4.61037 0.382989 4.61037L10.6924 4.61037L6.75083 0.647459C6.68318 0.574477 6.64635 0.477946 6.6481 0.378206C6.64985 0.278465 6.69004 0.183301 6.76021 0.112763C6.83038 0.0422247 6.92505 0.00181957 7.02427 5.97638e-05C7.12349 -0.00170004 7.21952 0.0353229 7.29212 0.103329L11.888 4.7233C11.9597 4.79549 12 4.89334 12 4.99537C12 5.09739 11.9597 5.19525 11.888 5.26743L7.29212 9.88741C7.22031 9.9595 7.12297 10 7.02147 10C6.91998 10 6.82264 9.9595 6.75083 9.88741Z" fill="white" />
                                </svg>
                            </StockButton>
                        </Link>

                    </Stack>
                    <Divider marginBlock="15px"></Divider>
                    <Stack>
                        <ProductDetails>
                            <span>
                                Price: <span class="amount">&euro;{(products[activeIndex % products.length]?.priceWithTax?.min / 100).toFixed(2)}{' '}</span>
                                {/*{products[activeIndex % products.length]?.currencyCode}*/}
                            </span>
                        </ProductDetails>
                    </Stack>
                </InfoBlock>
            </BottomStack>

        </CarouselContainer>

    );
};
