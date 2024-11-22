import { ProductDetailType } from '@/src/graphql/selectors';

export type Variant = ProductDetailType['variants'][number];

export type ProductContainerType = {
    product?: ProductDetailType;
    variant?: Variant;
    quantity: number;
    addingError?: string;
    handleVariant: (variant?: Variant) => void;
    handleAddToCart: () => void;
    handleSetItemQuantityInCart: (quantity: number) => void;
    handleBuyNow: () => void;
    handleOptionClick: (groupId: string, id: string) => void;
    productOptionsGroups: ProductOptionsGroup[];
};

export type OptionGroup = ProductDetailType['optionGroups'][0]['options'];
export type OptionGroupWithStock = OptionGroup[number] & { stockLevel: number; isSelected: boolean };
export type ProductOptionsGroup = OptionGroup[number] & {
    options: OptionGroupWithStock[];
};
