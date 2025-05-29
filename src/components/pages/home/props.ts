import { SSGQuery } from '@/src/graphql/client';
import { SearchResponseSelector, SearchSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { SortOrder } from '@/src/zeus';
import { PER_PAGE } from '@/src/state/collection/utils';
import { EnhancedProductType } from '@/src/types/product';
import { mapFacetValuesToFacets, extractProductAttributes } from '@/src/util/productHelpers';

const slugsOfBestOf = ['home-slider-snowboards'];

export const getStaticProps = async (ctx: ContextModel) => {
    try {
        const r = await makeStaticProps(['common', 'homepage'])(ctx);
        const api = await SSGQuery(r.context);

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

        const facetValueMap: Record<string, { code: string; name: string; value: string }> =
            allFacetsResponse.facets.items.reduce(
                (map, facet) => {
                    facet.values.forEach(value => {
                        map[value.id] = { code: facet.code, name: facet.name, value: value.name };
                    });
                    return map;
                },
                {} as Record<string, { code: string; name: string; value: string }>,
            );

        const productsWithFacets = products.items.map(product => {
            // Use our utility function to map facet values
            const facetValues = mapFacetValuesToFacets(product.facetValueIds || [], facetValueMap);

            // Use our utility function to extract terrain and level
            const { terrain, level } = extractProductAttributes(facetValues);

            return {
                ...product,
                facetValues,
                terrain: terrain || 'Unknown Terrain',
                level: level || 'Unknown Level',
                // Set facetIds to an empty array to ensure it's never undefined
                facetIds: [],
            };
        });

        const stockAndBrandData = await Promise.all(
            productsWithFacets.map(async product => {
                try {
                    const stockAndBrand = await api({
                        product: [
                            { id: product.productId },
                            {
                                customFields: {
                                    brand: true,
                                    quote: true,
                                    quoteOwner: true,
                                },
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

                    const inStock = stockAndBrand.product?.variants?.some(variant => Number(variant.stockLevel) > 0);

                    const variantData =
                        stockAndBrand.product?.variants?.map(variant => ({
                            id: variant.id,
                            stockLevel: variant.stockLevel || 0,
                            frontPhoto: variant?.customFields?.frontPhoto || null,
                            backPhoto: variant?.customFields?.backPhoto || null,
                        })) || [];

                    return {
                        product: product.productId,
                        brand: stockAndBrand.product?.customFields?.brand || 'Unknown Brand',
                        quote: stockAndBrand.product?.customFields?.quote,
                        quoteOwner: stockAndBrand.product?.customFields?.quoteOwner,
                        inStock: inStock || false,
                        variants: variantData,
                    };
                } catch (error) {
                    console.error(
                        `Failed to fetch stock, brand, and quote data for product ID: ${product.productId}`,
                        error,
                    );
                    return {
                        product: product.productId,
                        brand: 'Unknown Brand',
                        // quote: 'No Quote',
                        // quoteOwner: 'Unknown Owner',
                        inStock: false,
                        variants: [],
                    };
                }
            }),
        );

        const productsWithDetails: EnhancedProductType[] = productsWithFacets.map(product => {
            const stockAndBrand = stockAndBrandData.find(data => data.product === product.productId);
            return {
                ...product,
                facetIds: [], // Set facetIds to an empty array to ensure it's never undefined
                customFields: {
                    brand: stockAndBrand?.brand || 'Unknown Brand',
                    quote: stockAndBrand?.quote,
                    quoteOwner: stockAndBrand?.quoteOwner,
                    variants: stockAndBrand?.variants || [],
                },
                inStock: stockAndBrand?.inStock || false,
            };
        });

        const sliders = await Promise.all(
            slugsOfBestOf.map(async slug => {
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

                    const productsWithDetails: EnhancedProductType[] = await Promise.all(
                        productsInSlider.map(async product => {
                            try {
                                // Fetch additional details for brand
                                const productDetails = await api({
                                    product: [{ id: product.productId }, { customFields: { brand: true } }],
                                });

                                const brand = productDetails.product?.customFields?.brand || 'Unknown Brand';

                                // Use our utility function to map facet values
                                const facetValues = mapFacetValuesToFacets(product.facetValueIds, facetValueMap);

                                // Use our utility function to extract terrain and level
                                const { terrain, level } = extractProductAttributes(facetValues);

                                return {
                                    ...product,
                                    facetIds: [], // Set facetIds to an empty array to ensure it's never undefined
                                    customFields: { brand }, // Add brand to customFields
                                    facetValues, // Add mapped facetValues
                                    terrain: terrain || 'Unknown Terrain',
                                    level: level || 'Unknown Level',
                                };
                            } catch (error) {
                                console.error(`Failed to fetch brand for product ID: ${product.productId}`, error);

                                // Fallback product structure
                                const facetValues = mapFacetValuesToFacets(product.facetValueIds, facetValueMap);

                                return {
                                    ...product,
                                    facetIds: [], // Set facetIds to an empty array to ensure it's never undefined
                                    customFields: { brand: 'Unknown Brand' }, // Fallback brand
                                    facetValues, // Add mapped facetValues
                                    terrain: 'Unknown Terrain',
                                    level: 'Unknown Level',
                                };
                            }
                        }),
                    );

                    return { slug, products: productsWithDetails };
                } catch (error) {
                    console.error(`Failed to fetch slider data for slug: ${slug}`, error);
                    return { slug, products: [] };
                }
            }),
        );

        const collections = await getCollections(r.context);
        const { navigation, subnavigation } = await getNavigationTree(r.context, collections);

        return {
            props: {
                ...r.props,
                products: productsWithDetails.length
                    ? productsWithDetails
                    : [
                          {
                              productId: 'placeholder-id',
                              productName: 'Placeholder Product',
                              slug: 'placeholder-product',
                              productAsset: { preview: '' },
                              description: '',
                              facetValueIds: [],
                              facetIds: [], // Add facetIds property
                              facetValues: [],
                              terrain: 'Unknown Terrain',
                              level: 'Unknown Level',
                              inStock: false,
                              currencyCode: 'EUR',
                              priceWithTax: { min: 0, max: 0 },
                              customFields: {
                                  brand: 'Placeholder Brand',
                                  variants: [],
                              },
                              // Add missing properties required by EnhancedProductType
                              productVariantId: 'placeholder-variant-id',
                              productVariantName: 'Placeholder Variant',
                              collectionIds: [],
                          } as EnhancedProductType,
                      ],
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
