import { ProductVariantTileType } from '@/src/graphql/selectors';
import React from 'react';
import { TH2, Stack } from '@/src/components/atoms';

import { Slider } from '@/src/components/organisms/Slider';
import { ProductVariantTile } from '@/src/components/molecules/ProductVariantTile';

interface ProductPageProductsSliderProps {
    title: string;
    products: ProductVariantTileType[];
}

export const ProductPageProductsSlider: React.FC<ProductPageProductsSliderProps> = ({ products, title }) => {
    if (!products?.length) return null;
    const slides = products.map((variant, index) => <ProductVariantTile lazy key={index} variant={variant} />);

    return (
        <Stack w100 column gap="2rem" style={{ marginTop: '20px', marginBottom: '2rem' }}>
            {/*<TH2>{title}</TH2>*/}
            <Slider slides={slides} />
        </Stack>
    );
};
