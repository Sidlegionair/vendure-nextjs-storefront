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
        id: 'home',
        parentId: '',
        slug: '#',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Boardfinder',
        id: 'boardfinder',
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
        id: 'sustainable',
        parentId: '1',
        slug: 'stories/sustainable',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Outlet',
        id: 'outlet',
        parentId: '1',
        slug: 'stories/outlet',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Travel',
        id: 'travel',
        parentId: '1',
        slug: 'stories/travel',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Rent',
        id: 'rent',
        parentId: '1',
        slug: 'stories/rent',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Maintenance',
        id: 'maintenance',
        parentId: '1',
        slug: 'stories/maintenance',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Tutorials',
        id: 'tutorials',
        parentId: '1',
        slug: 'stories/tutorials',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    },
    {
        name: 'Stories',
        id: 'stories',
        parentId: '1',
        slug: 'stories/stories',
        description: '',
        productVariants: emptyProductVariants, // Use default empty structure
        children: [],
    }
];
