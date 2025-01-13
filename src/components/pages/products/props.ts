// ./src/components/pages/products/index.tsx

import { SSGQuery } from '@/src/graphql/client';
import { ProductDetailSelector, homePageSlidersSelector, ProductDetailType, ProductVariantTileType} from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';
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
const generateProductSpecs = (product: ProductDetailType, variant?: ProductVariantTileType): ProductSpec[] => {
    const specs: ProductSpec[] = [];

    if (typeof product?.customFields?.brand === 'string') {
        specs.push({ label: 'Brand', value: product.customFields.brand });
    }

    // Add more specs as needed
    /*
    if (product?.customFields) {
        Object.keys(product.customFields).forEach((key) => {
            if (key !== 'brand') {
                const specValue = product.customFields[key];
                specs.push({
                    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    value: specValue,
                });
            }
        });
    }

    if (variant?.customFields) {
        Object.keys(variant.customFields).forEach((key) => {
            const specValue = variant.customFields[key];
            specs.push({
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value: specValue,
            });
        });
    }
    */

    return specs;
};

//THIS IS NOT IN DEMO STORE - BUT MAKE SENSE TO KEEP IT LIKE THIS
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

export const getStaticProps = async (context: ContextModel<{ slug?: string }>) => {
    const r = await makeStaticProps(['common', 'products'])(context);
    const language = r.props._nextI18Next?.initialLocale || 'en';
    const { slug } = context.params || {};
    const api = SSGQuery(r.context);

    const response =
        typeof slug === 'string'
            ? await api({
                product: [{ slug }, ProductDetailSelector],
            })
            : null;

    if (!response?.product) return { notFound: true };

    const collections = await getCollections(r.context);
    const navigation = arrayToTree(collections);

    // Append main and sub-navigation from menuConfig
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };

    const relatedProducts = await api({
        collection: [{ slug: response.product?.collections?.[0]?.slug || 'search' }, homePageSlidersSelector],
    });

    const clientsAlsoBought = await api({
        collection: [{ slug: response.product?.collections?.[0]?.slug || 'search' }, homePageSlidersSelector],
    });

    const { optionGroups: _optionGroups, ...productData } = response.product;

    // Mapping option groups to match the color names <-> hex codes
    const getFacetsValues = await SSGQuery(r.context)({
        facets: [{ options: { filter: { name: { eq: 'color' } } } }, { items: { values: { name: true, code: true } } }],
    });

    const optionGroups = _optionGroups.map(og => ({
        ...og,
        options: og.options
            .sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name))
            .map(o => ({
                ...o,
                name: notInDemoStore.find(v => v.name.toLowerCase() === o.code.toLowerCase())?.code || o.name,
            })),
    }));

    // **Generate specs here**
    const specs = generateProductSpecs(response.product, undefined); // Pass variant if available

    const returnedStuff = {
        ...r.props,
        ...r.context,
        slug: context.params?.slug,
        product: {
            ...productData,
            optionGroups,

            // product: { // Nested 'product' to match ProductDetailType
            // },
        },
        collections,
        relatedProducts,
        clientsAlsoBought,
        navigation,
        subnavigation,
        language,
        specs, // Add specs to props
    };

    return {
        props: returnedStuff,
        revalidate: process.env.NEXT_REVALIDATE ? parseInt(process.env.NEXT_REVALIDATE) : 10,
    };
};
