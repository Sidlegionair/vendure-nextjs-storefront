import { SSGQuery } from '@/src/graphql/client';
import { SearchResponseSelector, FacetsSelector, CollectionSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';

import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';

import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { arrayToTree } from '@/src/util/arrayToTree';
import { SortOrder } from '@/src/zeus';
import { HomePageSlidersType, homePageSlidersSelector } from '@/src/graphql/selectors';
// import { ValueTypes } from '/mnt/data/index';

const slugsOfBestOf = ['snowboards'];

export const getStaticProps = async (ctx: ContextModel) => {
    const r = await makeStaticProps(['common', 'homepage'])(ctx);
    const api = SSGQuery(r.context);

    // Primary query to fetch SearchResult items
    const products = await api({
        search: [
            { input: { take: 15, groupByProduct: true, sort: { price: SortOrder.ASC } } },
            SearchResponseSelector,
        ],
    });

    // Fetch all facets to resolve facetValueIds
    const allFacets = await api({
        facets: [
            {}, // Fetch all facets
            {
                items: {
                    id: true,
                    name: true,
                    values: {
                        id: true,
                        name: true,
                    },
                },
            },
        ],
    });

    // Create a map of facetValueIds to their names
    const facetValueMap = allFacets.facets.items.reduce((map, facet) => {
        facet.values.forEach((value) => {
            map[value.id] = { name: facet.name, value: value.name };
        });
        return map;
    }, {} as Record<string, { name: string; value: string }>);

    // Map facets to each product
    const productsWithFacets = products.search.items.map((product) => {
        const levelFacet = product.facetValueIds
            .map((id) => facetValueMap[id])
            .filter((facet) => facet?.name.toLowerCase() === 'level')
            .map((facet) => facet?.value)
            .join(', ') || null;

        const terrainFacet = product.facetValueIds
            .map((id) => facetValueMap[id])
            .filter((facet) => facet?.name.toLowerCase() === 'terrain')
            .map((facet) => facet?.value)
            .join(', ') || null;

        return {
            ...product,
            level: levelFacet,
            terrain: terrainFacet,
        };
    });

    // Fetch stock levels and brand details in a separate query
    const stockAndBrandData = await Promise.all(
        productsWithFacets.map(async (product) => {
            const stockAndBrand = await api({
                product: [
                    { id: product.productId },
                    {
                        customFields: {
                            brand: true,
                        },
                        variants: {
                            id: true,
                            stockLevel: true,
                        },
                    },
                ],
            });

            // Determine if any variant has stockLevel "IN_STOCK"
            const inStock = stockAndBrand.product?.variants?.some(
                (variant) => Number(variant.stockLevel) > 0
            );

            return {
                product: product.productId,
                brand: stockAndBrand.product?.customFields?.brand || null,
                inStock,
            };
        })
    );

    // Merge stock and brand details with original product data
    const productsWithDetails = productsWithFacets.map((product) => {
        const stockAndBrand = stockAndBrandData.find((data) => data.product === product.productId);
        return {
            ...product,
            customFields: {
                brand: stockAndBrand?.brand || null,
            },
            inStock: stockAndBrand?.inStock || false,
        };
    });

    // Extract unique collection IDs
    const uniqueCollectionIds = [...new Set(productsWithDetails.flatMap((item) => item.collectionIds))];

    // Fetch collection details
    const collectionsData = await Promise.all(
        uniqueCollectionIds.map(async (id) => {
            const collectionData = await api({
                collection: [
                    { id },
                    CollectionSelector,
                ],
            });
            return collectionData.collection;
        })
    );

    // Fetch sliders
    const sliders = await Promise.all(
        slugsOfBestOf.map(async (slug) => {
            const section = await api({
                collection: [{ slug }, homePageSlidersSelector],
            });
            return section.collection || null;
        })
    ).then((result) => result.filter((x): x is HomePageSlidersType => x !== null));

    const collections = await getCollections(r.context);
    const navigation = arrayToTree(collections);

    // Append main and sub-navigation
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };

    return {
        props: {
            ...r.props,
            ...r.context,
            products: productsWithDetails,
            categories: collections,
            facetValues: allFacets.facets.items, // Use allFacets here
            collections: collectionsData,
            navigation,
            subnavigation,
            sliders,
        },
        revalidate: parseInt(process.env.NEXT_REVALIDATE || '10'),
    };
};

