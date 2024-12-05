import { ProductImage, Stack } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { ImageOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
type Asset = { source: string; preview: string } | undefined;

interface ProductPhotosPreview {
    featuredAsset: Asset;
    name?: string;
    images?: Asset[];
}

export const ProductPhotosPreview: React.FC<ProductPhotosPreview> = ({ featuredAsset, images, name }) => {
    const [chosenImage, setChosenImage] = useState<Asset>(featuredAsset ?? images?.[0]);

    useEffect(() => {
        if (typeof featuredAsset === 'undefined' && typeof images === 'undefined' && typeof chosenImage === 'undefined')
            return;
        setChosenImage(featuredAsset ?? images?.[0]);
    }, [featuredAsset, images]);

    return (
        <Wrapper w100 justifyBetween>
            <AssetBrowser column gap="1.75rem">
                {images?.map(a => {
                    const isSelected = chosenImage?.source === a?.source;
                    return (
                        <StyledProductImage
                            key={a?.preview}
                            size="thumbnail"
                            src={a?.preview}
                            onClick={() => setChosenImage(a)}
                            isSelected={isSelected}
                            alt={name}
                            title={name}
                        />
                    );
                })}
            </AssetBrowser>
            {chosenImage ? (
                <ProductImageContainer>
                    <ProductImage size="detail" src={chosenImage.preview} alt={name} title={name} />
                </ProductImageContainer>
            ) : (
                <NoImage size="60rem" />
            )}
        </Wrapper>
    );
};

const Wrapper = styled(Stack)`
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: 20px;
   
    //@media (min-width: 1024px) {
    //    flex-direction: row;
    //    align-items: flex-start;
    //    justify-content: space-between;
    //}
`;

const StyledProductImage = styled(ProductImage)<{ isSelected: boolean }>`
    cursor: pointer;
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0.4)};

    :hover {
        opacity: 1;
    }

    width: 151px;
    height: 140px;
    border: 1px solid ${({ isSelected }) => (isSelected ? '#0E4632' : 'rgba(77, 77, 77, 0.1)')};
    border-radius: 12px;
`;


const ProductImageContainer = styled.div`
    position: relative;
    width: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    //background: #FFFFFF;
    border: 1px solid rgba(77, 77, 77, 0.1);
    border-radius: 15px;

    img {
        width: 100%;
        object-fit: contain;
        object-position: center center;
    }
`;

const AssetBrowser = styled(Stack)`
    flex-direction: row;
    max-width: 100%;
    overflow-x: scroll;
    padding-bottom: 1rem;
    

    //@media (min-width: 1024px) {
    //    flex-direction: column;
    //    max-width: 52rem;
    //    max-height: 60rem;
    //    overflow-y: scroll;
    //    padding-bottom: 0;
    //    padding-right: 1rem;
    //}
    ::-webkit-scrollbar {
        height: 0.8rem;
        width: 0.8rem;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: ${p => p.theme.gray(200)};
        border-radius: 1rem;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${p => p.theme.gray(400)};
    }
`;
const NoImage = styled(ImageOff)`
    color: ${p => p.theme.gray(50)};
`;
