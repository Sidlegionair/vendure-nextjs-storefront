import { scalars } from '@/src/graphql/client';
import { FromSelector, Selector, SortOrder } from '@/src/zeus';

export type OrderStateType =
    | 'Created'
    | 'Draft'
    | 'AddingItems'
    | 'Cancelled'
    | 'ArrangingPayment'
    | 'PaymentAuthorized'
    | 'PaymentSettled'
    | 'PartiallyShipped'
    | 'Shipped'
    | 'PartiallyDelivered'
    | 'Delivered'
    | 'Modifying'
    | 'ArrangingAdditionalPayment';

export type NavigationType = CollectionTileType & {
    id: string; // Ensure this matches the required type
    parentId: string; // Ensure this matches the required type
    productVariants?: {
        items: CollectionTileProductVariantType[];
        totalItems: number;
    } | null;
};


export type FiltersFacetType = FacetType & { values: (FacetType & { count: number })[] };

export const ProductTileSelector = Selector('Product')({
    id: true,
    name: true,
    slug: true,
    collections: {
        name: true,
        slug: true,
    },
    variants: {
        currencyCode: true,
        price: true,
    },
    featuredAsset: {
        source: true,
        preview: true,
    },
});

export const ProductSearchSelector = Selector('SearchResult')({
    productName: true,
    productId: true,
    slug: true,
    collectionIds: true,
    currencyCode: true,
    productVariantId: true,
    productVariantName: true,
    priceWithTax: {
        '...on PriceRange': {
            max: true,
            min: true,
        },
        '...on SinglePrice': {
            value: true,
        },
    },
    facetIds: true,
    facetValueIds: true,
    productAsset: {
        preview: true,
    },
    description: true,
});
export type ProductSearchType = FromSelector<typeof ProductSearchSelector, 'SearchResult', typeof scalars>;

export const FacetSelector = Selector('Facet')({
    id: true,
    name: true,
    code: true,
});

export type FacetType = FromSelector<typeof FacetSelector, 'Facet', typeof scalars>;


export const ProductCustomFieldsSelector = Selector('Product')({
    id: true,
    name: true,
    customFields: {
        brand: true,
    },
});



export const CollectionSelector = Selector('Collection')({
    id: true,
    name: true,
    slug: true,
    description: true,
    featuredAsset: {
        preview: true,
    },
    parent: { slug: true, name: true },
    children: {
        id: true,
        name: true,
        slug: true,
        featuredAsset: { preview: true },
    },
});

export type CollectionType = FromSelector<typeof CollectionSelector, 'Collection', typeof scalars>;

// Define the SearchResponseSelector based on SearchResponse with nested SearchResult items
export const SearchResponseSelector = Selector('SearchResponse')({
    items: {
        productId: true,
        productName: true,
        slug: true,
        sku: true,
        description: true,
        priceWithTax: {
            '...on PriceRange': {
                max: true,
                min: true,
            },
            '...on SinglePrice': {
                value: true,
            },
        },
        productVariantId: true,
        productVariantName: true,
        productAsset: {
            preview: true,
        },
        currencyCode: true,
        facetValueIds: true,
        collectionIds: true,
    },
    totalItems: true,
});

export const FacetsSelector = Selector('Facet')({
    items: {
        id: true,
        name: true,
        values: {
            id: true,
            name: true,
        },
    },
});

export const SearchSelector = Selector('SearchResponse')({
    items: ProductSearchSelector,
    totalItems: true,
    facetValues: {
        count: true,
        facetValue: {
            ...FacetSelector,
            facet: FacetSelector,
        },
    },
});

export type SearchType = FromSelector<typeof SearchSelector, 'SearchResponse', typeof scalars>;

export const ProductSlugSelector = Selector('Product')({
    name: true,
    description: true,
    id: true,
    slug: true,
    facetValues: {
        name: true,
        code: true,
    },
});

export const ProductDetailsFacetSelector = Selector('FacetValue')({
    name: true,
    id: true,
    translations: { name: true, languageCode: true, id: true },
});

export type ProductDetailsFacetType = FromSelector<typeof ProductDetailsFacetSelector, 'FacetValue', typeof scalars>;

export const CollectionTileProductVariantSelector = Selector('ProductVariant')({
    id: true,
    featuredAsset: { preview: true },
    priceWithTax: true,
    currencyCode: true,
    name: true,
    product: { name: true, slug: true, featuredAsset: { preview: true } },
});

export type CollectionTileProductVariantType = FromSelector<
    typeof CollectionTileProductVariantSelector,
    'ProductVariant',
    typeof scalars
>;

export const CollectionTileSelector = Selector('Collection')({
    name: true,
    id: true,
    slug: true,
    parentId: true,
    parent: { slug: true },
    description: true,
    featuredAsset: {
        preview: true,
    },
});

export type CollectionTileType = FromSelector<typeof CollectionTileSelector, 'Collection', typeof scalars>;

export const ProductDetailSelector = Selector('Product')({
    name: true,
    description: true,
    id: true,
    featuredAsset: {
        preview: true,
        source: true
    },
    slug: true,
    optionGroups: {
        name: true,
        id: true,
        code: true,
        options: {
            name: true,
            id: true,
            code: true,
        },
    },
    assets: {
        source: true,
        preview: true,
    },
    variants: {
        id: true,
        name: true,
        currencyCode: true,
        priceWithTax: true,
        stockLevel: true,
        sku: true,
        options: {
            id: true,
            groupId: true,
            code: true,
            name: true,
        },
        assets: {
            source: true,
            preview: true,
        },
        customFields: {
            shortdescription: true,
            descriptionTab1Visible: true,
            descriptionTab1Label: true,
            descriptionTab1Content: true,
            descriptionTab2Visible: true,
            descriptionTab2Label: true,
            descriptionTab2Content: true,
            descriptionTab3Visible: true,
            descriptionTab3Label: true,
            descriptionTab3Content: true,

            // Option Tabs
            optionTab1Visible: true,
            optionTab1Label: true,
            optionTab1Bar1Visible: true,
            optionTab1Bar1Name: true,
            optionTab1Bar1Min: true,
            optionTab1Bar1Max: true,
            optionTab1Bar1Rating: true,
            optionTab1Bar1MinLabel: true,
            optionTab1Bar1MaxLabel: true,
            optionTab1Bar2Visible: true,
            optionTab1Bar2Name: true,
            optionTab1Bar2Min: true,
            optionTab1Bar2Max: true,
            optionTab1Bar2Rating: true,
            optionTab1Bar2MinLabel: true,
            optionTab1Bar2MaxLabel: true,
            optionTab1Bar3Visible: true,
            optionTab1Bar3Name: true,
            optionTab1Bar3Min: true,
            optionTab1Bar3Max: true,
            optionTab1Bar3Rating: true,
            optionTab1Bar3MinLabel: true,
            optionTab1Bar3MaxLabel: true,

            optionTab2Visible: true,
            optionTab2Label: true,
            // optionTab2Content: true, // Removed as Option Tabs don't have content
            optionTab2Bar1Visible: true,
            optionTab2Bar1Name: true,
            optionTab2Bar1Min: true,
            optionTab2Bar1Max: true,
            optionTab2Bar1Rating: true,
            optionTab2Bar1MinLabel: true,
            optionTab2Bar1MaxLabel: true,
            optionTab2Bar2Visible: true,
            optionTab2Bar2Name: true,
            optionTab2Bar2Min: true,
            optionTab2Bar2Max: true,
            optionTab2Bar2Rating: true,
            optionTab2Bar2MinLabel: true,
            optionTab2Bar2MaxLabel: true,
            optionTab2Bar3Visible: true,
            optionTab2Bar3Name: true,
            optionTab2Bar3Min: true,
            optionTab2Bar3Max: true,
            optionTab2Bar3Rating: true,
            optionTab2Bar3MinLabel: true,
            optionTab2Bar3MaxLabel: true,
            optionTab2Bar4Visible: true,
            optionTab2Bar4Name: true,
            optionTab2Bar4Min: true,
            optionTab2Bar4Max: true,
            optionTab2Bar4Rating: true,
            optionTab2Bar4MinLabel: true,
            optionTab2Bar4MaxLabel: true,
            optionTab3Visible: true,
            optionTab3Label: true,
            optionTab3Bar1Visible: true,
            optionTab3Bar1Name: true,
            optionTab3Bar1Min: true,
            optionTab3Bar1Max: true,
            optionTab3Bar1Rating: true,
            optionTab3Bar1MinLabel: true,
            optionTab3Bar1MaxLabel: true,
            optionTab3Bar2Visible: true,
            optionTab3Bar2Name: true,
            optionTab3Bar2Min: true,
            optionTab3Bar2Max: true,
            optionTab3Bar2Rating: true,
            optionTab3Bar2MinLabel: true,
            optionTab3Bar2MaxLabel: true,
            optionTab3Bar3Visible: true,
            optionTab3Bar3Name: true,
            optionTab3Bar3Min: true,
            optionTab3Bar3Max: true,
            optionTab3Bar3Rating: true,
            optionTab3Bar3MinLabel: true,
            optionTab3Bar3MaxLabel: true,

            // Variant-specific fields
            boardWidth: true,
            riderLengthMin: true,
            riderLengthMax: true,
            riderWeightMin: true,
            riderWeightMax: true,
            bootLengthMax: true,
            flex: true,
            noseWidth: true,
            waistWidth: true,
            tailWidth: true,
            taper: true,
            effectiveEdge: true,
            averageSidecutRadius: true,
            setback: true,
            stanceMin: true,
            stanceMax: true,
            weightKg: true,
            bindingSizeVariant: true
        }
    },
    customFields: {
        brand: true,
        warranty: true,
        camberProfile: true,
        profile: true,
        baseProfile: true,
        bindingSize: true,
        bindingMount: true,
        edges: true,
        sidewall: true,
        core: true,
        layup1: true,
        layup2: true,
        layup3: true,
        boardbase: true,
        terrain: true,
        taperProfile: true
    },
    collections: {
        slug: true,
        name: true,
        parent: {
            slug: true
        }
    },
    facetValues: ProductDetailsFacetSelector,
});



export type ProductDetailType = FromSelector<typeof ProductDetailSelector, 'Product', typeof scalars>;

export const NewestProductSelector = Selector('Product')({
    name: true,
    slug: true,
    featuredAsset: {
        source: true,
        preview: true,
    },
});

export type NewestProductType = FromSelector<typeof NewestProductSelector, 'Product', typeof scalars>;

export type ProductTileType = FromSelector<typeof ProductTileSelector, 'Product', typeof scalars>;

export const ProductVariantSelector = Selector('ProductVariant')({
    id: true,
    name: true,
    slug: true,
    collections: {
        name: true,
    },
    variants: {
        currencyCode: true,
        price: true,
    },
    featuredAsset: {
        source: true,
        preview: true,
    },
});

export const AvailableCountriesSelector = Selector('Country')({
    code: true,
    name: true,
    languageCode: true,
});
export type AvailableCountriesType = FromSelector<typeof AvailableCountriesSelector, 'Country', typeof scalars>;

export const OrderAddressSelector = Selector('OrderAddress')({
    fullName: true,
    company: true,
    streetLine1: true,
    streetLine2: true,
    city: true,
    province: true,
    postalCode: true,
    phoneNumber: true,
});

export type OrderAddressType = FromSelector<typeof OrderAddressSelector, 'OrderAddress', typeof scalars>;

export const ActiveAddressSelector = Selector('Address')({
    ...OrderAddressSelector,
    id: true,
    country: AvailableCountriesSelector,
    defaultShippingAddress: true,
    defaultBillingAddress: true,
});

export type ActiveAddressType = FromSelector<typeof ActiveAddressSelector, 'Address', typeof scalars>;

export const EditActiveAddressSelector = Selector('UpdateAddressInput')({
    id: true,
    fullName: true,
    company: true,
    streetLine1: true,
    streetLine2: true,
    city: true,
    province: true,
    postalCode: true,
    countryCode: true,
    phoneNumber: true,
    defaultShippingAddress: true,
    defaultBillingAddress: true,
});

export type EditActiveAddressType = FromSelector<
    typeof EditActiveAddressSelector,
    'UpdateAddressInput',
    typeof scalars
>;

export const CurrentUserSelector = Selector('CurrentUser')({
    id: true,
    identifier: true,
});

export type CurrentUserType = FromSelector<typeof CurrentUserSelector, 'CurrentUser', typeof scalars>;

export const ActiveCustomerSelector = Selector('Customer')({
    id: true,
    lastName: true,
    firstName: true,
    emailAddress: true,
    phoneNumber: true,
    addresses: ActiveAddressSelector,
    user: CurrentUserSelector,
    customFields: {
        preferredSeller: {
            id: true
        }
    }
});

export type ActiveCustomerType = FromSelector<typeof ActiveCustomerSelector, 'Customer', typeof scalars>;

export const paymentSelector = Selector('Payment')({
    id: true,
    method: true,
    amount: true,
    state: true,
    errorMessage: true,
});

export type PaymentType = FromSelector<typeof paymentSelector, 'Payment', typeof scalars>;

export const discountsSelector = Selector('Discount')({
    type: true,
    description: true,
    amountWithTax: true,
    adjustmentSource: true,
});

export type DiscountsType = FromSelector<typeof discountsSelector, 'Discount', typeof scalars>;

export const shippingLineSelector = Selector('ShippingLine')({
    shippingMethod: {
        id: true,
        name: true,
        description: true,
    },
    priceWithTax: true,
});
export type ShippingLineType = FromSelector<typeof shippingLineSelector, 'ShippingLine', typeof scalars>;

// ActiveOrderSelector
export const ActiveOrderSelector = Selector('Order')({
    id: true,
    createdAt: true,
    updatedAt: true,
    totalQuantity: true,
    couponCodes: true,
    code: true,
    customer: {
        id: true,
        emailAddress: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
    },
    shippingWithTax: true,
    totalWithTax: true,
    subTotalWithTax: true,
    discounts: discountsSelector,
    state: true,
    active: true,
    payments: paymentSelector,
    currencyCode: true,
    shippingLines: shippingLineSelector,
    lines: {
        id: true,
        quantity: true,
        linePriceWithTax: true,
        unitPriceWithTax: true,
        discountedLinePriceWithTax: true,
        featuredAsset: {
            id: true,
            preview: true,
        },
        productVariant: {
            name: true,
            id: true,
            sku: true,
            price: true,
            featuredAsset: {
                id: true,
                source: true,
            },
            stockLevel: true,
            product: {
                name: true,
                slug: true,
                customFields: {
                    brand: true,
                },
            },
        },
    },
});

// Infer ActiveOrderType based on ActiveOrderSelector and scalars
export type ActiveOrderType = FromSelector<typeof ActiveOrderSelector, 'Order', typeof scalars>;

export const OrderSelector = Selector('Order')({
    type: true,

    shippingWithTax: true,
    totalWithTax: true,
    subTotalWithTax: true,
    discounts: discountsSelector,
    state: true,
    active: true,
    payments: paymentSelector,
    currencyCode: true,
    shippingLines: shippingLineSelector,
    lines: {
        id: true,
        quantity: true,
        linePriceWithTax: true,
        unitPriceWithTax: true,
        discountedLinePriceWithTax: true,
        featuredAsset: {
            id: true,
            preview: true,
        },
        productVariant: {
            name: true,
            currencyCode: true,
            featuredAsset: {
                id: true,
                source: true,
            },
            product: {
                slug: true,
                name: true,
                customFields: {
                    brand: true
                }
            },
        },
    },
});
export type OrderType = FromSelector<typeof OrderSelector, 'Order', typeof scalars>;
export const ShippingMethodsSelector = Selector('ShippingMethodQuote')({
    id: true,
    name: true,
    price: true,
    description: true,
});

export type ShippingMethodType = FromSelector<typeof ShippingMethodsSelector, 'ShippingMethodQuote', typeof scalars>;

export const AvailablePaymentMethodsSelector = Selector('PaymentMethodQuote')({
    id: true,
    name: true,
    description: true,
    code: true,
    isEligible: true,
});

export type AvailablePaymentMethodsType = FromSelector<
    typeof AvailablePaymentMethodsSelector,
    'PaymentMethodQuote',
    typeof scalars
>;

export const CreateCustomerSelector = Selector('CreateCustomerInput')({
    emailAddress: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
});

export type CreateCustomerType = FromSelector<typeof CreateCustomerSelector, 'CreateCustomerInput', typeof scalars>;

export const CreateAddressSelector = Selector('CreateAddressInput')({
    fullName: true,
    company: true,
    streetLine1: true,
    streetLine2: true,
    city: true,
    province: true,
    postalCode: true,
    countryCode: true,
    phoneNumber: true,
    defaultShippingAddress: true,
    defaultBillingAddress: true,
});

export type CreateAddressType = FromSelector<typeof CreateAddressSelector, 'CreateAddressInput', typeof scalars>;

export const RegisterCustomerInputSelector = Selector('RegisterCustomerInput')({
    emailAddress: true,
    password: true,
});

export type RegisterCustomerInputType = FromSelector<
    typeof RegisterCustomerInputSelector,
    'RegisterCustomerInput',
    typeof scalars
>;

export type LoginCustomerInputType = {
    emailAddress: string;
    password: string;
    rememberMe: boolean;
};

export const YAMLProductsSelector = Selector('Product')({
    id: true,
    name: true,
    slug: true,
    featuredAsset: {
        source: true,
        preview: true,
    },
    collections: {
        name: true,
        slug: true,
    },
    variants: {
        id: true,
        name: true,
        currencyCode: true,
        priceWithTax: true,
        stockLevel: true,
        assets: {
            source: true,
            preview: true,
        },
        featuredAsset: {
            source: true,
            preview: true,
        },
    },
});

export type YAMLProductsType = FromSelector<typeof YAMLProductsSelector, 'Product', typeof scalars>;

export const productVariantTileSelector = Selector('ProductVariant')({
    id: true,
    name: true,
    currencyCode: true,
    priceWithTax: true,
    featuredAsset: { preview: true },
    assets: {
        source: true,
        preview: true,
    },
    product: {
        collections: { slug: true, name: true, parent: { slug: true } },
        slug: true,
        featuredAsset: { preview: true },
        facetValues: { ...FacetSelector, facet: FacetSelector },
        customFields: {
            brand: true
        }
    },
});

export type ProductVariantTileType = FromSelector<typeof productVariantTileSelector, 'ProductVariant', typeof scalars>;

export const homePageSlidersSelector = Selector('Collection')({
    id: true,
    name: true,
    slug: true,
    parent: { slug: true },
    assets: {
        source: true,
        preview: true,
    },

    productVariants: [
        { options: { take: 8, sort: { priceWithTax: SortOrder.DESC } } },
        {
            totalItems: true,
            items: productVariantTileSelector,
        },
    ],
});

export type HomePageSlidersType = FromSelector<typeof homePageSlidersSelector, 'Collection', typeof scalars>;
