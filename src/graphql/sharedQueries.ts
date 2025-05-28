import { SSGQuery, storefrontApiQuery } from '@/src/graphql/client';
import {
    CollectionTileSelector,
    CollectionTileProductVariantType,
    CollectionTileProductVariantSelector,
    ServiceLocationSelector,
    ServiceLocationType,
} from '@/src/graphql/selectors';
import { SortOrder } from '@/src/zeus';
import { DEFAULT_CHANNEL, DEFAULT_CHANNEL_SLUG } from '@/src/lib/consts';


export const GetMainNavigation = (params: { locale: string; channel: string }) => {

};

export const GetSubNavigation = () => {

}

export const getServiceLocationForProduct = async (
    params: { locale: string; channel: string },
    productId: string
): Promise<ServiceLocationType | null> => {
    try {
        const result = await storefrontApiQuery(params)({
            getServiceLocationForProduct: [
                { productId },
                ServiceLocationSelector
            ]
        });
        return result.getServiceLocationForProduct;
    } catch (error) {
        console.error('Error fetching service location:', error);
        return null;
    }
};

export const getCollections = async (params: { locale: string; channel: string }) => {
    const excludedSlugs = ['carousel-snowboards', 'home-slider-snowboards']; // Replace with slugs you want to exclude

    params.channel = DEFAULT_CHANNEL;

    const _collections = await SSGQuery(params)({
        collections: [
            { options: { filter: { slug: { notIn: excludedSlugs } } } }, // Exclude collections based on slug
            { items: CollectionTileSelector },
        ],
    });

    let variantForCollections: {
        id: string;
        productVariants?: { totalItems: number; items: CollectionTileProductVariantType[] };
    }[] = [];

    try {
        variantForCollections = await Promise.all(
            _collections.collections.items.map(async c => {
                const products = await SSGQuery(params)({
                    collection: [
                        { slug: c.slug },
                        {
                            productVariants: [
                                { options: { take: 4, sort: { createdAt: SortOrder.ASC } } },
                                { totalItems: true, items: CollectionTileProductVariantSelector },
                            ],
                        },
                    ],
                });
                return { ...c, productVariants: products.collection?.productVariants };
            }),
        );
    } catch (e) {
        variantForCollections = [];
    }

    const collections = _collections.collections.items
        .filter(c => !excludedSlugs.includes(c.slug)) // Additional hardcoded filter if needed
        .map(c => {
            const collection = variantForCollections.length
                ? variantForCollections.find(p => p.id === c.id)
                : { productVariants: { items: [], totalItems: 0 } };

            return { ...c, productVariants: collection?.productVariants };
        });

    return collections;
};
