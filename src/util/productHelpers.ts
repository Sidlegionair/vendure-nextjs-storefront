// src/util/productHelpers.ts

import { FacetValueType } from '@/src/types/product';

/**
 * Extracts a specific facet value from an array of facet values
 */
export const getFacetValue = (facetValues: FacetValueType[] | undefined, code: string): string | undefined => {
    return facetValues?.find(f => f.code === code)?.value;
};

/**
 * Maps facet value IDs to facet values using a lookup map
 */
export const mapFacetValuesToFacets = (
    facetValueIds: string[],
    facetValueMap: Record<string, { code: string; name: string; value: string }>,
): FacetValueType[] => {
    // Define a type that matches the exact shape of objects we're creating
    type MappedFacetValue = {
        id: string;
        code: string;
        name: string;
        value: string;
        facet: {
            code: string;
            name: string;
            id: string;
        };
    };

    // First create an array that might contain null values
    const mappedValues = facetValueIds.map(id => {
        const facet = facetValueMap[id];
        if (!facet) return null;

        return {
            id,
            code: facet.code,
            name: facet.name,
            value: facet.value,
            facet: {
                code: facet.code,
                name: facet.name,
                id: id,
            },
        };
    });

    // Then filter out null values using a type predicate that matches our created objects
    // and cast the result to FacetValueType[] which is compatible since FacetValueType.value is optional
    return mappedValues.filter((f): f is MappedFacetValue => f !== null) as FacetValueType[];
};

/**
 * Extracts terrain and level from facet values
 */
export const extractProductAttributes = (
    facetValues: FacetValueType[] | undefined,
): { terrain?: string; level?: string } => {
    if (!facetValues?.length) return {};

    const terrain = facetValues
        .filter(facet => facet.code === 'terrain')
        .map(facet => facet.value)
        .join(', ');

    const level = facetValues
        .filter(facet => facet.code === 'rider-level')
        .map(facet => facet.value)
        .join(', ');

    return {
        terrain: terrain || undefined,
        level: level || undefined,
    };
};
