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

    // Fetch stock levels and brand details in a separate query
    const stockAndBrandData = await Promise.all(
        products.search.items.map(async (product) => {
            const stockAndBrand = await api({
                product: [
                    { id: product.productId },
                    {
                        customFields: {
                            brand: true
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
                productId: product.id,
                brand: stockAndBrand.product?.customFields?.brand || null,
                inStock,
            };
        })
    );

    // Merge the stock and brand details with the original product data
    const productsWithStockAndBrand = products.search.items.map((product) => {
        const stockAndBrand = stockAndBrandData.find((data) => data.productId === product.id);
        return {
            ...product,
            brand: stockAndBrand?.brand || null,
            inStock: stockAndBrand?.inStock || false,
        };
    });

    // Facet query without input argument to get all facets and their values
    const facetData = await api({
        facets: [
            {}, // No input argument here
            FacetsSelector,
        ],
    });

    // Extract unique collection IDs from product search
    const uniqueCollectionIds = [...new Set(productsWithStockAndBrand.flatMap((item) => item.collectionIds))];

    // Fetch collection details for each unique ID
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

    // Additional data for sliders and collections
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

    // Append main and sub-navigation from menuConfig
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };

    return {
        props: {
            ...r.props,
            ...r.context,
            products: productsWithStockAndBrand,
            categories: collections,
            facetValues: facetData.facets.items,
            collections: collectionsData,
            navigation,
            subnavigation,
            sliders,
        },
        revalidate: parseInt(process.env.NEXT_REVALIDATE || '10'),
    };
};
