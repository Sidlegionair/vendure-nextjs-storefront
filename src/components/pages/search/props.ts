import { SSRQuery } from '@/src/graphql/client';
import { CollectionSelector, FacetSelector, ProductSearchSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';
import { makeServerSideProps } from '@/src/lib/getStatic';
import { redirectFromDefaultChannelSSR } from '@/src/lib/redirect';
import { PER_PAGE, prepareFilters, reduceFacets } from '@/src/state/collection/utils';
import { arrayToTree } from '@/src/util/arrayToTree';
import { SortOrder, GraphQLTypes } from '@/src/zeus';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'collections'])(context);
    const translationRedirect = redirectFromDefaultChannelSSR(context);
    if (translationRedirect) return translationRedirect;

    const collections = await getCollections(r.context);
    const { navigation, subnavigation } = await getNavigationTree(
        r.context,
        collections
    );

    const api = SSRQuery(context);

    let page = 1;
    let q = '';
    let sort = { key: 'name', direction: 'ASC' as SortOrder };
    if (context.query.sort) {
        const [key, direction] = (context.query.sort as string).split('-');
        sort = { key, direction: direction.toUpperCase() as SortOrder };
    }
    if (context.query.q) {
        q = context.query.q as string;
    }
    if (context.query.page) {
        page = parseInt(context.query.page as string);
    }

    const { collection } = await api({
        collection: [{ slug: 'search' }, CollectionSelector],
    });
    const facetsQuery = await api({
        search: [
            { input: { term: q, collectionSlug: 'search', groupByProduct: true, take: PER_PAGE } },
            { facetValues: { count: true, facetValue: { ...FacetSelector, facet: FacetSelector } } },
        ],
    });
    const facets = reduceFacets(facetsQuery.search.facetValues);
    const filters = prepareFilters(context.query, facets);

    const facetValueFilters: GraphQLTypes['FacetValueFilterInput'][] = [];
    Object.entries(filters).forEach(([key, value]) => {
        const facet = facets.find(f => f.id === key);
        if (!facet) return;
        const filter: GraphQLTypes['FacetValueFilterInput'] = {};
        if (value.length === 1) filter.and = value[0];
        else filter.or = value;
        facetValueFilters.push(filter);
    });

    const input = {
        term: q,
        collectionSlug: 'search',
        groupByProduct: true,
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        facetValueFilters,
        sort: sort.key === 'title' ? { name: sort.direction } : { price: sort.direction },
    };

    // Fetch snowboards
    const productsQuery = await api({
        search: [{ input }, { items: ProductSearchSelector, totalItems: true }],
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
                brand: matchingBrandData?.brand || null,
            }, // Map the brand or fallback to null
        };
    });

    const returnedStuff = {
        ...r.props,
        ...r.context,
        collections,
        facets,
        navigation,
        subnavigation,
        collection,
        products: productsWithBrands, // Use snowboards with brands
        totalProducts: productsQuery.search.totalItems,
        filters,
        searchQuery: q,
        page,
    };

    return { props: returnedStuff };
};
