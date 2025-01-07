// src/config/menuConfig.ts
import { CollectionTileProductVariantType } from '@/src/graphql/selectors';

type NavigationItemType = {
    name: string;
    id: string;
    parentId: string;
    slug: string;
    description: string;
    productVariants: {
        totalItems: number;
        items: CollectionTileProductVariantType[];
    };
    children: NavigationItemType[];
};

// Default empty productVariants structure
const emptyProductVariants = {
    totalItems: 0,
    items: [] as CollectionTileProductVariantType[],
};

// Define the mainNavigation array with productVariants always defined
export const mainNavigation: NavigationItemType[] = [
    {
        name: 'Home',
        id: 'none',
        parentId: '',
        slug: '',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Boardtech',
        id: 'none',
        parentId: '1',
        slug: 'content/boardtech',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
];

// Define the subNavigation array with productVariants always defined
export const subNavigation: NavigationItemType[] = [
    {
        name: 'Powder',
        id: 'none',
        parentId: '1',
        slug: 'collections/snowboarding/?terrain=powder&page=1',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Freeride',
        id: 'none',
        parentId: '1',
        slug: 'collections/snowboarding/?style=freeride',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'All mountain',
        id: 'none',
        parentId: '1',
        slug: 'collections/snowboarding/?page=1&terrain=all+mountain',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Brands',
        id: 'none',
        parentId: '1',
        slug: 'content/brands',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
];
