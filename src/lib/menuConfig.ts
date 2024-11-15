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
        slug: '#',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Boardfinder',
        id: 'none',
        parentId: '1',
        slug: 'stories/boardfinder',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
];

// Define the subNavigation array with productVariants always defined
export const subNavigation: NavigationItemType[] = [
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
        name: 'Outlet',
        id: 'none',
        parentId: '1',
        slug: 'stories/outlet',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Travel',
        id: 'none',
        parentId: '1',
        slug: 'stories/travel',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Rent',
        id: 'none',
        parentId: '1',
        slug: 'stories/rent',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Maintenance',
        id: 'none',
        parentId: '1',
        slug: 'stories/maintenance',
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
        name: 'Stories',
        id: 'none',
        parentId: '1',
        slug: 'stories/articles',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    }
];
