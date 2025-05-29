// src/types/product.ts

import { ProductSearchType as BaseProductSearchType } from '@/src/graphql/selectors';

// Define the facet value structure consistently
export interface FacetValueType {
    id: string;
    code: string;
    name: string;
    value?: string; // Make value optional
    facet: {
        code: string;
        name: string;
        id: string;
    };
}

// Define custom fields structure
export interface ProductCustomFields {
    brand?: string;
    quote?: string;
    quoteOwner?: string;
    variants?: Array<{
        id?: string;
        stockLevel?: string | number;
        frontPhoto?: { id: string; source: string; preview: string } | null;
        backPhoto?: { id: string; source: string; preview: string } | null;
    }>;
    [key: string]: unknown;
}

// Define the enhanced product type that extends the base type
export interface EnhancedProductType extends BaseProductSearchType {
    // Additional properties derived from facets
    terrain?: string;
    level?: string;
    inStock?: boolean;

    // Mapped facet values
    facetValues?: FacetValueType[];

    // Custom fields
    customFields?: ProductCustomFields;
}

// Define a utility type for carousel-specific needs
export interface CarouselProductType {
    id: string;
    name: string;
    slug?: string;
    featuredAsset?: { preview: string };
    description?: string;
    inStock?: boolean;
    terrain?: string;
    level?: string;
    priceWithTax?: { min: number; max?: number } | { value: number } | { min?: number; max?: number; value?: number };
    customFields?: ProductCustomFields;
    // Allow for backward compatibility
    productId?: string;
    productName?: string;
    productAsset?: { preview: string };
}
