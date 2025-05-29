import { Stack } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { ImageOff } from 'lucide-react';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSwipeable } from 'react-swipeable'; // Import the swipeable hook

type Asset = { source: string; preview: string } | undefined;

interface ProductPhotosPreview {
    featuredAsset: Asset;
    name?: string;
    images?: Asset[];
}

export const ProductPhotosPreview: React.FC<ProductPhotosPreview> = ({ featuredAsset, images, name }) => {
    const [chosenImage, setChosenImage] = useState<Asset>(featuredAsset ?? images?.[0]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // Ref to maintain scroll position
    const assetBrowserRef = useRef<HTMLDivElement>(null);

    // Update chosenImage and currentIndex when featuredAsset or images change
    useEffect(() => {
        if (!featuredAsset && !images && !chosenImage) return;
        const initialImage = featuredAsset ?? images?.[0];
        setChosenImage(initialImage);
        setCurrentIndex(images ? images.indexOf(initialImage as Asset) : 0);
    }, [featuredAsset, images]);

    // Memoize thumbnails to prevent unnecessary re-renders
    const Thumbnails = useMemo(() => {
        return images?.map((a, index) => {
            const isSelected = chosenImage?.source === a?.source;
            return (
                <StyledThumbnail
                    key={a?.source} // Ensure unique and stable key
                    src={a?.preview || ''} // Set the background image
                    isSelected={isSelected}
                    onClick={() => {
                        setChosenImage(a);
                        setCurrentIndex(index);
                    }}
                    title={name}
                />
            );
        });
    }, [images, chosenImage, name]);

    // Handle swipe gestures
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (images && currentIndex < images.length - 1) {
                const nextIndex = currentIndex + 1;
                setChosenImage(images[nextIndex]);
                setCurrentIndex(nextIndex);
                scrollToThumbnail(nextIndex);
            }
        },
        onSwipedRight: () => {
            if (images && currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                setChosenImage(images[prevIndex]);
                setCurrentIndex(prevIndex);
                scrollToThumbnail(prevIndex);
            }
        },
        // preventDefaultTouchmoveEvent: true,
        trackMouse: true, // Optional: allows swipe with mouse as well
    });

    // Function to scroll the thumbnails into view when navigating via swipe
    const scrollToThumbnail = (index: number) => {
        const thumbnail = assetBrowserRef.current?.children[index] as HTMLElement;
        if (thumbnail) {
            thumbnail.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    };

    return (
        <Wrapper w100 justifyBetween>
            {/* Thumbnails */}
            {images?.length ? <AssetBrowser ref={assetBrowserRef}>{Thumbnails}</AssetBrowser> : null}

            {/* Main Image with swipe handlers */}
            <ImageWrapper {...handlers}>
                {chosenImage ? (
                    <ProductImageContainer src={chosenImage.preview} title={name} />
                ) : (
                    <NoImage size="60rem" />
                )}
            </ImageWrapper>
        </Wrapper>
    );
};

// Styled Components

const Wrapper = styled(Stack)`
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: 20px;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: auto;
        flex: 1;
    }
`;

const ProductImageContainer = styled.div<{ src: string }>`
    position: relative;
    width: 100%;
    height: 650px;
    border: 1px solid ${({ theme }) => theme.border.lightgray};
    border-radius: 15px;
    overflow: hidden;
    background-image: url(${({ src }) => src});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        height: 300px;
    }
`;

const AssetBrowser = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 1rem;

    ::-webkit-scrollbar {
        height: 0.8rem;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.text.accentGreen};
        border-radius: 1rem;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        max-width: 40rem;
        height: 650px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 0;
        padding-right: 1rem;
    }
`;

const StyledThumbnail = styled.div<{ src: string; isSelected: boolean }>`
    cursor: pointer;
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0.6)};
    transition:
        opacity 0.3s ease,
        border 0.3s ease;
    background-image: url(${({ src }) => src});
    background-size: cover; /* Changed to cover for better thumbnail fitting */
    background-position: center;
    background-repeat: no-repeat;
    width: 80px;
    height: 80px;
    border: 2px solid ${({ isSelected, theme }) => (isSelected ? theme.text.accentGreen : 'transparent')};
    border-radius: 12px;
    flex-shrink: 0; /* Prevent thumbnails from shrinking */

    :hover {
        opacity: 1;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 60px;
        height: 60px;
    }
`;

const NoImage = styled(ImageOff)`
    color: ${({ theme }) => theme.text.lightgray};
    width: 60rem;
    height: 60rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        height: 50vh;
    }
`;
