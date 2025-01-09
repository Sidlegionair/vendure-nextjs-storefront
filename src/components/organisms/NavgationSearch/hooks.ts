import { storefrontApiQuery } from '@/src/graphql/client';
import {
    ProductSearchSelector,
    ProductSearchType,
    FacetsSelector,
} from '@/src/graphql/selectors';
import { usePush } from '@/src/lib/redirect';
import { useChannels } from '@/src/state/channels';
import { useDebounce } from '@/src/util/hooks/useDebounce';
import { SortOrder } from '@/src/zeus';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useNavigationSearch = () => {
    const ctx = useChannels();
    const { query, asPath } = useRouter();
    const push = usePush();

    const [searchOpen, setSearchOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(query.q ? query.q.toString() : '');
    const [searchResults, setSearchResults] = useState<ProductSearchType[]>([]);
    const debouncedSearch = useDebounce(searchQuery, 200);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!searchOpen) return;
        setSearchOpen(false);
    }, [asPath]);

    const toggleSearch = () => setSearchOpen((prev) => !prev);
    const closeSearch = () => {
        toggleSearch();
        setSearchQuery('');
        setSearchResults([]);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.length < 3) return;
        push(`/search?q=${searchQuery}`);
    };

    useEffect(() => {
        if (!debouncedSearch || debouncedSearch.length < 3) {
            setSearchResults([]);
            return;
        }

        const getResults = async () => {
            try {
                setLoading(true);

                // Fetch search results
                const results = await storefrontApiQuery(ctx)({
                    search: [
                        {
                            input: {
                                term: debouncedSearch,
                                take: 6,
                                groupByProduct: true,
                                sort: { price: SortOrder.DESC },
                            },
                        },
                        { items: ProductSearchSelector, totalItems: true },
                    ],
                });

                const products = results.search.items;

                // Fetch all facets for enrichment
                const facets = await storefrontApiQuery(ctx)({
                    facets: [
                        {},
                        {
                            items: {
                                id: true,
                                name: true,
                                code: true, // Include facet code
                                values: {
                                    id: true,
                                    name: true,
                                    code: true, // Include facet value code
                                },
                            },
                        },
                    ],
                });

                const facetValueMap = facets.facets.items.reduce((map, facet) => {
                    facet.values.forEach((value) => {
                        map[value.id] = {
                            code: value.code,
                            name: value.name,
                            value: value.name,
                            facet: {
                                code: facet.code,
                                name: facet.name,
                            },
                        };
                    });
                    return map;
                }, {} as Record<string, { code: string; name: string; value: string; facet: { code: string; name: string } }>);

                // Enrich snowboards with facetValues and brand
                const enrichedResults = await Promise.all(
                    products.map(async (product) => {
                        const facetValues = product.facetValueIds
                            .map((id) => facetValueMap[id])
                            .filter(Boolean); // Filter out undefined facet values

                        const stockAndBrand = await storefrontApiQuery(ctx)({
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

                        const inStock = stockAndBrand.product?.variants?.some(
                            (variant) => Number(variant.stockLevel) > 0
                        );

                        return {
                            ...product,
                            facetValues, // Add enriched facetValues
                            customFields: {
                                brand: stockAndBrand.product?.customFields?.brand || null,
                            },
                            inStock,
                        };
                    })
                );

                setSearchResults(enrichedResults);
                setTotalItems(results.search.totalItems);
            } catch (error) {
                console.error(error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        getResults();
    }, [debouncedSearch]);

    return {
        searchOpen,
        toggleSearch,
        loading,
        searchQuery,
        searchResults,
        totalItems,
        setSearchQuery,
        closeSearch,
        onSubmit,
    };
};
