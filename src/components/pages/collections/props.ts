import { SSGQuery } from '@/src/graphql/client';
import { CollectionSelector, SearchSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';

import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { PER_PAGE, reduceFacets } from '@/src/state/collection/utils';
import { arrayToTree } from '@/src/util/arrayToTree';
import { SortOrder } from '@/src/zeus';

export const getStaticProps = async (context: ContextModel<{ slug?: string[] }>) => {
    const { slug } = context.params || {};
    const lastIndexSlug = slug?.length ? slug[slug.length - 1] : '';
    const _context = {
        ...context,
        params: { ...context.params, slug: lastIndexSlug },
    };

    const r = await makeStaticProps(['common', 'collections'])(_context);
    const collections = await getCollections(r.context);
    const navigation = arrayToTree(collections);

    // Append main and sub-navigation from menuConfig
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };
    const api = SSGQuery(r.context);

    const { collection } = await api({
        collection: [{ slug: lastIndexSlug }, CollectionSelector],
    });
    if (!collection) return { notFound: true };

    // Fetch snowboards
    const productsQuery = await api({
        search: [
            {
                input: {
                    collectionSlug: lastIndexSlug,
                    groupByProduct: true,
                    take: PER_PAGE,
                    sort: { name: SortOrder.ASC },
                },
            },
            SearchSelector,
        ],
    });

    // Fetch brands
    const productIds = productsQuery.search.items
        .map(product => product.productId)
        .filter(id => !!id); // Ensure only valid IDs are used.

    if (productIds.length === 0) {
        console.error('No valid product IDs found for brand query.');
    }

    const brandData = await Promise.all(
        productIds.map(async id => {
            try {
                const { product } = await api({
                    product: [{ id }, { customFields: { brand: true } }],
                });

                if (!product) {
                    console.warn(`No product found for ID: ${id}`);
                }

                return { id, brand: product?.customFields?.brand || null };
            } catch (error) {
                console.error(`Failed to fetch brand for product ID: ${id}`, error);
                return { id, brand: null }; // Fallback to null on failure
            }
        })
    );

    // Map brands to snowboards
    const productsWithBrands = productsQuery.search.items.map(product => {
        const matchingBrandData = brandData.find(brand => brand.id === product.productId);
        if (!matchingBrandData) {
            console.warn(`No brand data found for product ID: ${product.productId}`);
        }

        return {
            ...product,
            customFields: {
                brand: matchingBrandData?.brand || null
            }, // Map the brand or fallback to null
        };
    });

    // console.log(productsWithBrands);

    const facets = reduceFacets(productsQuery.search.facetValues);

    const returnedStuff = {
        ...r.props,
        ...r.context,
        slug: context.params?.slug,
        collections: collections,
        name: collections.find(c => c.slug === lastIndexSlug)?.name ?? null, // Use null fallback
        products: productsWithBrands,
        facets,
        totalProducts: productsQuery.search?.totalItems,
        collection,
        navigation,
        subnavigation
    };

    return {
        props: returnedStuff,
        revalidate: process.env.NEXT_REVALIDATE ? parseInt(process.env.NEXT_REVALIDATE) : 10,
    };

};
