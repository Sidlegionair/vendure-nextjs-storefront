import { SSGQuery } from '@/src/graphql/client';
import {
    ProductDetailSelector,
    homePageSlidersSelector,
    ProductDetailType,
    ProductVariantTileType,
} from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { arrayToTree } from '@/src/util/arrayToTree';
import React from 'react';
import { InferGetStaticPropsType } from 'next';

// Define ProductSpec interface
interface ProductSpec {
    label: string;
    value: string | number | JSX.Element;
}

// Function to generate specs
const generateProductSpecs = (
    product: ProductDetailType,
    variant?: ProductVariantTileType
): ProductSpec[] => {
    const specs: ProductSpec[] = [];

    if (typeof product?.customFields?.brand === 'string') {
        specs.push({ label: 'Brand', value: product.customFields.brand });
    }

    return specs;
};

// THIS IS NOT IN DEMO STORE - BUT MAKES SENSE TO KEEP IT LIKE THIS
const notInDemoStore = [
    { name: 'blue', code: '#0000FF' },
    { name: 'pink', code: '#FFC0CB' },
    { name: 'black', code: '#000000' },
    { name: 'gray', code: '#808080' },
    { name: 'brown', code: '#964B00' },
    { name: 'wood', code: '#A1662F' },
    { name: 'yellow', code: '#FFFF00' },
    { name: 'green', code: '#008000' },
    { name: 'white', code: '#FFFFFF' },
    { name: 'red', code: '#FF0000' },
    { name: 'mustard', code: '#FFDB58' },
    { name: 'mint', code: '#98FF98' },
    { name: 'pearl', code: '#FDEEF4' },
];

export const getStaticProps = async (
    context: ContextModel<{ slug?: string }>
) => {
    const r = await makeStaticProps(['common', 'products'])(context);
    const language = r.props._nextI18Next?.initialLocale || 'en';
    const { slug } = context.params || {};
    const api = SSGQuery(r.context);


    console.log(context);

    // Base product fetch
    const response =
        typeof slug === 'string'
            ? await api({
                product: [{ slug }, ProductDetailSelector],
            })
            : null;

    if (!response?.product) return { notFound: true };

    const collections = await getCollections(r.context);
    const { navigation, subnavigation } = await getNavigationTree(
        r.context,
        collections
    );

    // Base queries for related products & clientsAlsoBought (using homePageSlidersSelector)
    // const relatedProducts = await api({
    //     collection: [
    //         { slug: response.product?.collections?.[0]?.slug || 'search' },
    //         homePageSlidersSelector,
    //     ],
    // });
    const clientsAlsoBought = await api({
        collection: [
            { slug: response.product?.collections?.[0]?.slug || 'search' },
            homePageSlidersSelector,
        ],
    });

    const { optionGroups: _optionGroups, ...productData } = response.product;

    // Mapping option groups to match the color names <-> hex codes
    const getFacetsValues = await SSGQuery(r.context)({
        facets: [
            { options: { filter: { name: { eq: 'color' } } } },
            { items: { values: { name: true, code: true } } },
        ],
    });

    const optionGroups = _optionGroups.map((og) => ({
        ...og,
        options: og.options
            .sort(
                (a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name)
            )
            .map((o) => ({
                ...o,
                name:
                    notInDemoStore.find(
                        (v) => v.name.toLowerCase() === o.code.toLowerCase()
                    )?.code || o.name,
            })),
    }));

    // **Generate specs here**
    const specs = generateProductSpecs(response.product, undefined); // Pass variant if available

    // ---- NEW: Enrich clientsAlsoBought with extra data (following the sliders example) ----
    // First, fetch all facets to build a lookup map
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
    const facetValueMap =
        allFacetsResponse?.facets?.items.reduce((map, facet) => {
            facet.values.forEach((value) => {
                map[value.id] = { code: facet.code, name: facet.name, value: value.name };
            });
            return map;
        }, {} as Record<string, { code: string; name: string; value: string }>) ||
        {};

    // Enrich each product from clientsAlsoBought using the same logic as in the sliders example.
    let enrichedClientsAlsoBought = clientsAlsoBought;
    if (
        clientsAlsoBought &&
        clientsAlsoBought.collection &&
        Array.isArray((clientsAlsoBought.collection as any).items)
    ) {
        (enrichedClientsAlsoBought.collection as any).items = await Promise.all(
            ((clientsAlsoBought.collection as any).items as any[]).map(async (product: any) => {
                try {
                    // Fetch additional details for brand
                    const productDetails = await api({
                        product: [
                            { id: product.productId },
                            { customFields: { brand: true } },
                        ],
                    });
                    const brand =
                        productDetails.product?.customFields?.brand || 'Unknown Brand';

                    // Map facetValues for this product
                    const facetValues = Array.from(
                        new Map(
                            product.facetValueIds.map((id: string) => [
                                id,
                                facetValueMap[id] ||
                                { code: 'Unknown', name: 'Unknown', value: 'Unknown' },
                            ])
                        ).values()
                    );

                    return {
                        ...product,
                        customFields: { brand },
                        facetValues,
                    };
                } catch (error) {
                    console.error(
                        `Failed to enrich clientsAlsoBought product with ID: ${product.productId}`,
                        error
                    );
                    const facetValues = Array.from(
                        new Map(
                            product.facetValueIds.map((id: string) => [
                                id,
                                facetValueMap[id] ||
                                { code: 'Unknown', name: 'Unknown', value: 'Unknown' },
                            ])
                        ).values()
                    );
                    return {
                        ...product,
                        customFields: { brand: 'Unknown Brand' },
                        facetValues,
                    };
                }
            })
        );
    }
    // ------------------------------------------------------------------------------------

    const returnedStuff = {
        ...r.props,
        ...r.context,
        slug: context.params?.slug,
        product: {
            ...productData,
            optionGroups,
        },
        collections,
        // relatedProducts,
        // Wrap the enriched object in an array so it aligns with SliderType[]
        clientsAlsoBought: enrichedClientsAlsoBought ? [enrichedClientsAlsoBought] : [],
        navigation,
        subnavigation,
        language,
        specs,
    };

    return {
        props: returnedStuff,
        revalidate: process.env.NEXT_REVALIDATE
            ? parseInt(process.env.NEXT_REVALIDATE)
            : 10,
    };
};
