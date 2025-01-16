import React, { useEffect, useState } from 'react';
import { HomePageSliders } from '@/src/components/organisms/HomePageSliders';
import { SSGQuery } from '@/src/graphql/client';
import { ProductSearchType, SearchSelector } from '@/src/graphql/selectors';
import { SortOrder } from '@/src/zeus';
import { DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE } from '@/src/lib/consts';

interface SliderType {
    slug: string;
    products: ProductSearchType[];
}

interface CollectionSliderProps {
    blok: {
        slugs: string; // Comma-separated slugs
        title?: string; // Optional title for the slider section
    };
}

// Function to fetch slider data for a single collection
const fetchSliderData = async (slug: string, take = 15): Promise<SliderType> => {
    const api = SSGQuery({ locale: DEFAULT_LOCALE, channel: DEFAULT_CHANNEL_SLUG });

    try {
        const productsQuery = await api({
            search: [
                {
                    input: {
                        collectionSlug: slug,
                        groupByProduct: true,
                        take,
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

        const facetValueMap: Record<string, { code: string; name: string; value: string }> =
            allFacetsResponse?.facets?.items.reduce((map, facet) => {
                facet.values.forEach((value) => {
                    map[value.id] = {
                        code: facet.code,
                        name: facet.name,
                        value: value.name,
                    };
                });
                return map;
            }, {} as Record<string, { code: string; name: string; value: string }>);

        const productsWithFacets = productsQuery.search.items.map((product) => {
            const facetValues = product.facetValueIds?.map((id) => {
                return facetValueMap[id] || { code: 'Unknown', name: 'Unknown', value: 'Unknown' };
            });

            return {
                ...product,
                facetValues, // Attach facetValues array to each product
            };
        });

        return { slug, products: productsWithFacets };
    } catch (error) {
        console.error(`Failed to fetch slider data for slug: ${slug}`, error);
        return { slug, products: [] };
    }
};

// Main `CollectionSlider` Component
const CollectionSlider: React.FC<CollectionSliderProps> = ({ blok }) => {
    const [sliders, setSliders] = useState<SliderType[]>([]);
    const { slugs, title } = blok;

    useEffect(() => {
        if (slugs) {
            const slugArray = slugs.split(',').map((slug) => slug.trim());
            Promise.all(slugArray.map((slug) => fetchSliderData(slug))).then(setSliders);
        }
    }, [slugs]);

    if (!sliders.length) {
        return <p>No sliders found. Please specify valid slugs in Storyblok.</p>;
    }

    return (
        <div>
            {title && <h2>{title}</h2>}
            <HomePageSliders sliders={sliders} seeAllText="See All" />
        </div>
    );
};

export default CollectionSlider;