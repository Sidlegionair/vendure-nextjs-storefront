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
        name: 'Snowboards',
        id: 'none',
        parentId: '1',
        slug: 'stories/snowboards',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
];

// Define the subNavigation array with productVariants always defined
export const subNavigation: NavigationItemType[] = [
    {
        name: 'Boardbrands',
        id: 'none',
        parentId: '1',
        slug: 'stories/boardbrands',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Sustainable',
        id: 'none',
        parentId: '1',
        slug: 'stories/sustainable',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Powder',
        id: 'none',
        parentId: '1',
        slug: 'stories/powder',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Freeride',
        id: 'none',
        parentId: '1',
        slug: 'stories/freeride',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'All mountain',
        id: 'none',
        parentId: '1',
        slug: 'stories/all_mountain',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Park',
        id: 'none',
        parentId: '1',
        slug: 'stories/park',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Tutorials',
        id: 'none',
        parentId: '1',
        slug: 'stories/tutorials',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'About us',
        id: 'none',
        parentId: '1',
        slug: 'stories/about-us',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    }

];
