import { useEffect, useMemo, useState } from 'react';
import { createContainer } from 'unstated-next';
import { CollectionType, FiltersFacetType, ProductSearchType, SearchSelector } from '@/src/graphql/selectors';
import { GraphQLTypes, SortOrder } from '@/src/zeus';
import { storefrontApiQuery } from '@/src/graphql/client';
import { useRouter } from 'next/router';
import { PER_PAGE, collectionsEmptyState, reduceFacets } from './utils';
import { CollectionContainerType, Sort } from './types';
import { useChannels } from '../channels';

type EnrichedProductType = ProductSearchType & {
    customFields?: {
        brand?: string | null;
    };
};

const useCollectionContainer = createContainer<
    CollectionContainerType,
    {
        collection: CollectionType;
        products: ProductSearchType[];
        totalProducts: number;
        facets: FiltersFacetType[];
        searchQuery?: string;
        filters?: { [key: string]: string[] };
        sort?: Sort;
        page?: number;
    }
>(initialState => {
    if (!initialState?.collection) return collectionsEmptyState;

    const ctx = useChannels();
    const [collection] = useState(initialState.collection);
    const [products, setProducts] = useState(initialState.products);
    const [totalProducts, setTotalProducts] = useState(initialState.totalProducts);
    const [facetValues, setFacetValues] = useState(initialState.facets);
    const [filters, setFilters] = useState<{ [key: string]: string[] }>(
        initialState.filters ? initialState.filters : {},
    );
    const initialSort = initialState.sort || { key: 'title', direction: SortOrder.ASC };
    const [sort, setSort] = useState(initialSort);
    const [currentPage, setCurrentPage] = useState(initialState.page || 1);
    const [q, setQ] = useState<string | undefined>(initialState.searchQuery);
    const router = useRouter(); // Correctly obtain router instance
    const [filtersOpen, setFiltersOpen] = useState(false); // Add this state
    const [brandData, setBrandData] = useState<{ id: string; brand: string | null }[]>([]);

    const totalPages = useMemo(() => Math.ceil(totalProducts / PER_PAGE), [totalProducts]);

    // Initialize filters and other state based on router query
    useEffect(() => {
        if (!router.isReady) return;

        const { query } = router;

        const initialFilters: { [key: string]: string[] } = {};

        Object.keys(query).forEach(key => {
            if (key !== 'page' && key !== 'sort') {
                const value = query[key];

                let values: string[] = [];

                if (Array.isArray(value)) {
                    // If it's an array, split each string by ',' and flatten the result
                    values = value.flatMap(v => v.split(','));
                } else if (typeof value === 'string') {
                    // If it's a single string, split by ','
                    values = value.split(',');
                }

                initialFilters[key] = values;
            }
        });

        setFilters(initialFilters);

        const initialPage = parseInt((query.page as string) || '1', 10);
        setCurrentPage(initialPage);

        const initialSort = initialState.sort || { key: 'title', direction: SortOrder.ASC };
        setSort(initialSort);

        const initialSearchQuery = query.q as string | undefined;
        setQ(initialSearchQuery);

        // Fetch products based on initial state
        getFilteredProducts(initialFilters, initialPage, initialSort, initialSearchQuery);
    }, [router.isReady, router.query]);

    // Fetch brand data
    useEffect(() => {
        const fetchBrandData = async () => {
            const productIds = products.map(p => p.productId).filter(Boolean);

            if (productIds.length === 0) {
                console.error('No valid product IDs found for brand query.');
                return;
            }

            const brands = await Promise.all(
                productIds.map(async id => {
                    try {
                        const { product } = await storefrontApiQuery(ctx)({
                            product: [{ id }, { customFields: { brand: true } }],
                        });

                        return {
                            id,
                            brand: typeof product?.customFields?.brand === 'string' ? product.customFields.brand : null, // Ensure brand is string or null
                        };
                    } catch (error) {
                        console.error(`Failed to fetch brand for product ID: ${id}`, error);
                        return { id, brand: null }; // Fallback to null
                    }
                }),
            );

            setBrandData(brands); // No error here now
        };

        fetchBrandData();
    }, [products, ctx]);

    // Enrich products with facets and brand data
    const enrichedProducts: EnrichedProductType[] = useMemo(() => {
        if (!facetValues.length && !brandData.length) return products;

        const facetValueMap = facetValues.reduce(
            (map, facet) => {
                facet.values.forEach(value => {
                    map[value.id] = { name: facet.name, code: facet.code, value: value.name };
                });
                return map;
            },
            {} as Record<string, { name: string; code: string; value: string }>,
        );

        const brandMap = brandData.reduce(
            (map, brandEntry) => {
                map[brandEntry.id] = brandEntry.brand;
                return map;
            },
            {} as Record<string, string | null>,
        );

        return products.map(product => {
            const enrichedFacets = product.facetValueIds.map(id => facetValueMap[id]).filter(Boolean);

            const brand = brandMap[product.productId] || null;

            return {
                ...product,
                facetValues: enrichedFacets,
                customFields: {
                    brand,
                },
            };
        });
    }, [products, facetValues, brandData]);

    const applyFilter = async (group: { id: string; name: string }, value: { id: string; name: string }) => {
        // Use a functional update so we always start with the latest state.
        setFilters(prev => {
            const updatedGroupFilters = [...(prev[group.id] || []), value.id].filter(
                (id, index, self) => self.indexOf(id) === index,
            );
            const newState = { ...prev, [group.id]: updatedGroupFilters };

            // Update URL only on the client side
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                // Note: we use group.name as the query param here because that’s how you update the URL.
                const existingValues = url.searchParams.get(group.name)?.split(',') || [];
                if (!existingValues.includes(value.name)) {
                    url.searchParams.set(group.name, [...existingValues, value.name].join(','));
                }
                url.searchParams.set('page', '1'); // Reset to page 1 on filter change
                window.history.pushState({}, '', url.toString());
                // Fetch filtered products based on new state.
                getFilteredProducts(newState, 1, sort, q);
            }

            return newState;
        });
    };

    const removeFilter = async (group: { id: string; name: string }, value: { id: string; name: string }) => {
        setFilters(prev => {
            const updatedGroupFilters = prev[group.id]?.filter(id => id !== value.id) || [];
            const newState = updatedGroupFilters.length
                ? { ...prev, [group.id]: updatedGroupFilters }
                : Object.fromEntries(Object.entries(prev).filter(([key]) => key !== group.id));

            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                const existingValues = url.searchParams.get(group.name)?.split(',') || [];
                const filteredValues = existingValues.filter(v => v !== value.name);
                if (filteredValues.length) {
                    url.searchParams.set(group.name, filteredValues.join(','));
                } else {
                    url.searchParams.delete(group.name);
                }
                url.searchParams.set('page', '1'); // Reset page
                window.history.pushState({}, '', url.toString());
                getFilteredProducts(newState, 1, sort, q);
            }

            return newState;
        });
    };

    // Fetch filtered products
    const getFilteredProducts = async (state: { [key: string]: string[] }, page: number, sort: Sort, q?: string) => {
        if (page < 1) page = 1;
        const facetValueFilters: GraphQLTypes['FacetValueFilterInput'][] = Object.entries(state).reduce(
            (filtersAcc, [key, value]) => {
                const facet = initialState.facets.find(f => f.id === key);
                if (!facet) return filtersAcc; // Skip if facet not found

                filtersAcc.push(value.length === 1 ? { and: value[0] } : { or: value });
                return filtersAcc;
            },
            [] as GraphQLTypes['FacetValueFilterInput'][],
        );

        const input: GraphQLTypes['SearchInput'] = {
            collectionSlug: collection.slug,
            groupByProduct: true,
            facetValueFilters,
            take: PER_PAGE,
            skip: PER_PAGE * (page - 1),
            sort: sort.key === 'title' ? { name: sort.direction } : { price: sort.direction },
            term: q,
        };

        try {
            const { search } = await storefrontApiQuery(ctx)({
                search: [{ input }, SearchSelector],
            });

            setProducts(search.items);
            setTotalProducts(search?.totalItems || 0);
            setFacetValues(reduceFacets(search?.facetValues || []));
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            // Optionally, set an error state here
        }
    };

    const handleSort = async (newSort: Sort) => {
        setSort(newSort);
        await getFilteredProducts(filters, currentPage, newSort, q);
    };

    return {
        searchPhrase: q || '',
        collection,
        products: enrichedProducts,
        facetValues,
        sort,
        paginationInfo: {
            currentPage,
            totalPages,
            totalProducts,
            itemsPerPage: PER_PAGE,
        },
        changePage: async page => {
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('page', page.toString());
                window.history.pushState({}, '', url.toString());
                setCurrentPage(page);
                await getFilteredProducts(filters, page, sort, q);
            }
        },
        filtersOpen,
        setFiltersOpen, // Expose setter
        filters,
        applyFilter,
        removeFilter,
        handleSort, // Expose handleSort
    };
});

export const useCollection = useCollectionContainer.useContainer;
export const CollectionProvider = useCollectionContainer.Provider;
