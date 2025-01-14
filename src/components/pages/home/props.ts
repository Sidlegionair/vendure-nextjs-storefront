import { SSGQuery } from '@/src/graphql/client';
import {
    ProductSearchType,
    SearchResponseSelector,
    SearchSelector,
} from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { arrayToTree } from '@/src/util/arrayToTree';
import { SortOrder } from '@/src/zeus';
import { PER_PAGE } from '@/src/state/collection/utils';

const slugsOfBestOf = ['home-slider-snowboards'];

export const getStaticProps = async (ctx: ContextModel) => {
    try {
        const r = await makeStaticProps(['common', 'homepage'])(ctx);
        const api = SSGQuery(r.context);

        const mainProductCollectionSlug = process.env.MAIN_PRODUCTS_COLLECTION_SLUG || 'default-carousel';
        const mainProductsQuery = {
            input: {
                take: 15,
                groupByProduct: true,
                sort: { price: SortOrder.ASC },
                ...(mainProductCollectionSlug && { collectionSlug: mainProductCollectionSlug }),
            },
        };
        const productsResponse = await api({ search: [mainProductsQuery, SearchResponseSelector] });

        if (!productsResponse?.search?.items) {
            throw new Error('Invalid products response structure.');
        }

        const products = productsResponse.search;

        const allFacetsResponse = await api({
            facets: [
                {},
                {
                    items: {
                        id: true,
                        name: true,
                        code: true,
                        values: { code: true, id: true, name: true },
                    },
                },
            ],
        });

        if (!allFacetsResponse?.facets?.items) {
            throw new Error('Invalid facets response structure.');
        }

        const facetValueMap: Record<
            string,
            { code: string; name: string; value: string }
        > = allFacetsResponse.facets.items.reduce(
            (map, facet) => {
                facet.values.forEach((value) => {
                    map[value.id] = { code: value.code, name: facet.name, value: value.name };
                });
                return map;
            },
            {} as Record<string, { code: string; name: string; value: string }>
        );

        const productsWithFacets = products.items.map((product) => {
            const uniqueFacets = Array.from(
                new Map(
                    product.facetValueIds?.map((id) => [
                        id,
                        facetValueMap[id] || { code: 'Unknown', name: 'Unknown', value: 'Unknown' },
                    ])
                ).values()
            );

            const levelFacet =
                uniqueFacets
                    .filter((facet) => facet.name.toLowerCase() === 'level')
                    .map((facet) => facet.value)
                    .join(', ') || 'Unknown Level';

            const terrainFacet =
                uniqueFacets
                    .filter((facet) => facet.name.toLowerCase() === 'terrain')
                    .map((facet) => facet.value)
                    .join(', ') || 'Unknown Terrain';

            return {
                ...product,
                level: levelFacet,
                terrain: terrainFacet,
                uniqueFacets,
            };
        });

        const stockAndBrandData = await Promise.all(
            productsWithFacets.map(async (product) => {
                try {
                    const stockAndBrand = await api({
                        product: [
                            { id: product.productId },
                            {
                                customFields: { brand: true },
                                variants: {
                                    id: true,
                                    stockLevel: true,
                                    customFields: {
                                        frontPhoto: { id: true, preview: true, source: true },
                                        backPhoto: { id: true, preview: true, source: true },
                                    },
                                },
                            },
                        ],
                    });

                    const inStock = stockAndBrand.product?.variants?.some(
                        (variant) => Number(variant.stockLevel) > 0
                    );

                    const variantData =
                        stockAndBrand.product?.variants?.map((variant) => ({
                            id: variant.id,
                            stockLevel: variant.stockLevel || 0,
                            frontPhoto: variant?.customFields?.frontPhoto || null,
                            backPhoto: variant?.customFields?.backPhoto || null,
                        })) || [];

                    return {
                        product: product.productId,
                        brand: typeof stockAndBrand.product?.customFields?.brand === 'string'
                            ? stockAndBrand.product.customFields.brand
                            : 'Unknown Brand',
                        inStock: inStock || false,
                        variants: variantData,
                    };
                } catch (error) {
                    console.error(`Failed to fetch stock and brand data for product ID: ${product.productId}`, error);
                    return {
                        product: product.productId,
                        brand: 'Unknown Brand',
                        inStock: false,
                        variants: [],
                    };
                }
            })
        );

        const productsWithDetails = productsWithFacets.map((product) => {
            const stockAndBrand = stockAndBrandData.find((data) => data.product === product.productId);
            return {
                ...product,
                customFields: {
                    brand: stockAndBrand?.brand || 'Unknown Brand',
                    variants: stockAndBrand?.variants || [],
                },
                inStock: stockAndBrand?.inStock || false,
            };
        });

        const sliders = await Promise.all(
            slugsOfBestOf.map(async (slug) => {
                try {
                    const productsQuery = await api({
                        search: [
                            {
                                input: {
                                    collectionSlug: slug,
                                    groupByProduct: true,
                                    take: PER_PAGE,
                                    sort: { name: SortOrder.ASC },
                                },
                            },
                            SearchSelector,
                        ],
                    });

                    if (!productsQuery?.search?.items) {
                        console.warn(`No products found for slider slug: ${slug}`);
                        return { slug, products: [] };
                    }

                    const productsInSlider = productsQuery.search.items;

                    const productsWithDetails: ProductSearchType[] = await Promise.all(
                        productsInSlider.map(async (product) => {
                            try {
                                // Fetch additional details for brand
                                const productDetails = await api({
                                    product: [
                                        { id: product.productId },
                                        { customFields: { brand: true } },
                                    ],
                                });

                                const brand = productDetails.product?.customFields?.brand || 'Unknown Brand';

                                // Map facetValues
                                const facetValues = Array.from(
                                    new Map(
                                        product.facetValueIds.map((id) => [
                                            id,
                                            facetValueMap[id] || { code: 'Unknown', name: 'Unknown', value: 'Unknown' },
                                        ])
                                    ).values()
                                );

                                return {
                                    ...product,
                                    customFields: { brand }, // Add brand to customFields
                                    facetValues, // Add mapped facetValues
                                };
                            } catch (error) {
                                console.error(`Failed to fetch brand for product ID: ${product.productId}`, error);

                                // Fallback product structure
                                const facetValues = Array.from(
                                    new Map(
                                        product.facetValueIds.map((id) => [
                                            id,
                                            facetValueMap[id] || { code: 'Unknown', name: 'Unknown', value: 'Unknown' },
                                        ])
                                    ).values()
                                );

                                return {
                                    ...product,
                                    customFields: { brand: 'Unknown Brand' }, // Fallback brand
                                    facetValues, // Add mapped facetValues
                                };
                            }
                        })
                    );

                    return { slug, products: productsWithDetails };
                } catch (error) {
                    console.error(`Failed to fetch slider data for slug: ${slug}`, error);
                    return { slug, products: [] };
                }
            })
        );



        const collections = await getCollections(r.context);
        const navigation = arrayToTree(collections);
        navigation.children.unshift(...mainNavigation);
        const subnavigation = { children: [...subNavigation] };

        return {
            props: {
                ...r.props,
                products: productsWithDetails.length ? productsWithDetails : [{ name: 'Placeholder Product', slug: 'placeholder-product' }],
                navigation: navigation || { children: [] },
                subnavigation: subnavigation || { children: [] },
                sliders: sliders.length ? sliders : [{ slug: 'placeholder-slider', products: [] }],
                categories: collections || [],
            },
            revalidate: parseInt(process.env.NEXT_REVALIDATE || '10', 10),
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return { notFound: true };
    }
};
