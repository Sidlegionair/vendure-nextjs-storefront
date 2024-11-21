// props.ts

import { SSGQuery } from '@/src/graphql/client';
import { SearchResponseSelector, FacetsSelector, CollectionSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { arrayToTree } from '@/src/util/arrayToTree';
import { SortOrder } from '@/src/zeus';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';
import { HomePageSlidersType, homePageSlidersSelector } from '@/src/graphql/selectors';
// import { ValueTypes } from '/mnt/data/index';

const slugsOfBestOf = ['home-garden'];

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

    // Facet query without input argument to get all facets and their values
    const facetData = await api({
        facets: [
            {}, // No input argument here
            FacetsSelector,
        ],
    });

    // Extract unique collection IDs from product search
    const uniqueCollectionIds = [...new Set(products.search.items.flatMap((item) => item.collectionIds))];

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

    // Fetch stock levels for each product based on productId
    const stockLevels = await Promise.all(
        products.search.items.map(async (product) => {
            const stockData = await api({
                product: [
                    { id: product.productId },
                    {
                        variants: {
                            id: true,
                            stockLevel: true,
                        },
                    },
                ],
            });

            // Determine if any variant has stockLevel "IN_STOCK"
            const inStock = stockData.product?.variants?.some(
                (variant) => Number(variant.stockLevel) > 0
            ) || false;

            return {
                productId: product.productId,
                variants: stockData.product?.variants || [],
                inStock,
            };
        })
    );

    // Combine stock data into products array
    const productsWithStock = products.search.items.map((product) => ({
        ...product,
        inStock: stockLevels.find((stock) => stock.productId === product.productId)?.inStock || false,
        variants: stockLevels.find((stock) => stock.productId === product.productId)?.variants || [],
    }));

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
            products: productsWithStock,
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
