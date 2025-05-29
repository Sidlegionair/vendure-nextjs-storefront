import { storefrontApiMutation, storefrontApiQuery } from '@/src/graphql/client';
import { ActiveOrderSelector, ActiveOrderType } from '@/src/graphql/selectors';
import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { useChannels } from './channels';

const DEFAULT_CHANNEL = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL_SLUG || 'default-channel';
const DEFAULT_LOCALE = 'en';

const useCartContainer = createContainer(() => {
    const ctx = useChannels();
    const [activeOrder, setActiveOrder] = useState<ActiveOrderType>();
    const [isLogged, setIsLogged] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    // Merge context with defaults, last-wins ensures fallbacks
    const getCtx = () => ({
        ...ctx!,
        channel: ctx?.channel ?? DEFAULT_CHANNEL,
        locale: ctx?.locale ?? DEFAULT_LOCALE,
    });

    const fetchActiveOrder = async () => {
        try {
            console.log('Starting fetchActiveOrder');
            const mergedCtx = getCtx();
            console.log('Context for queries:', mergedCtx);

            let orderResponse, customerResponse;
            try {
                console.log('Fetching activeOrder');
                orderResponse = await storefrontApiQuery(mergedCtx)({ activeOrder: ActiveOrderSelector });
                console.log('activeOrder response:', orderResponse);
            } catch (orderError) {
                console.error('Error fetching activeOrder:', orderError);
                throw orderError;
            }

            try {
                console.log('Fetching activeCustomer');
                customerResponse = await storefrontApiQuery(mergedCtx)({ activeCustomer: { id: true } });
                console.log('activeCustomer response:', customerResponse);
            } catch (customerError) {
                console.error('Error fetching activeCustomer:', customerError);
                throw customerError;
            }

            const { activeOrder } = orderResponse;
            const { activeCustomer } = customerResponse;

            console.log('Fetched activeOrder:', activeOrder);
            console.log('Fetched activeCustomer:', activeCustomer);

            setActiveOrder(activeOrder);
            setIsLogged(!!activeCustomer?.id);
            console.log('Updated state - isLogged:', !!activeCustomer?.id);

            return activeOrder;
        } catch (e) {
            console.error('Exception in fetchActiveOrder:', e);
            // Re-throw the error so the caller knows something went wrong
            throw e;
        }
    };

    useEffect(() => {
        if (ctx) {
            console.log('MOUNTED CART with ctx:', getCtx());
            fetchActiveOrder();
        }
    }, [ctx]);

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') fetchActiveOrder();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [ctx]);

    const addToCart = async (id: string, quantity: number, openModal?: boolean) => {
        setActiveOrder(c => (c ? { ...c, totalQuantity: c.totalQuantity + quantity } : c));
        try {
            const { addItemToOrder } = await storefrontApiMutation(getCtx())({
                addItemToOrder: [
                    { productVariantId: id, quantity, customFields: { requestedSellerChannel: getCtx().channel } },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on OrderLimitError': { errorCode: true, message: true },
                        '...on InsufficientStockError': { errorCode: true, message: true },
                        '...on NegativeQuantityError': { errorCode: true, message: true },
                        '...on OrderModificationError': { errorCode: true, message: true },
                        '...on OrderInterceptorError': { message: true, errorCode: true },
                    },
                ],
            });
            if (addItemToOrder.__typename === 'Order') {
                setActiveOrder(addItemToOrder);
                if (openModal) open();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const removeFromCart = async (orderLineId: string) => {
        setActiveOrder(c => (c ? { ...c, lines: c.lines.filter(l => l.id !== orderLineId) } : c));
        try {
            const { removeOrderLine } = await storefrontApiMutation(getCtx())({
                removeOrderLine: [
                    { orderLineId },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on OrderModificationError': { errorCode: true, message: true },
                        '...on OrderInterceptorError': { message: true, errorCode: true },
                    },
                ],
            });
            if (removeOrderLine.__typename === 'Order') {
                setActiveOrder(removeOrderLine);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const setItemQuantityInCart = async (orderLineId: string, quantity: number) => {
        setActiveOrder(c =>
            c
                ? {
                      ...c,
                      lines: c.lines.map(l => (l.id === orderLineId ? { ...l, quantity } : l)),
                  }
                : c,
        );
        try {
            const { adjustOrderLine } = await storefrontApiMutation(getCtx())({
                adjustOrderLine: [
                    { orderLineId, quantity },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on OrderLimitError': { errorCode: true, message: true },
                        '...on InsufficientStockError': { errorCode: true, message: true },
                        '...on NegativeQuantityError': { errorCode: true, message: true },
                        '...on OrderModificationError': { errorCode: true, message: true },
                        '...on OrderInterceptorError': { message: true, errorCode: true },
                    },
                ],
            });
            if (adjustOrderLine.__typename === 'Order') {
                setActiveOrder(adjustOrderLine);
            }
            return adjustOrderLine;
        } catch (e) {
            console.error(e);
        }
    };

    const applyCouponCode = async (code: string) => {
        try {
            const { applyCouponCode } = await storefrontApiMutation(getCtx())({
                applyCouponCode: [
                    { couponCode: code },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on CouponCodeExpiredError': { errorCode: true, message: true },
                        '...on CouponCodeInvalidError': { errorCode: true, message: true },
                        '...on CouponCodeLimitError': { errorCode: true, message: true },
                    },
                ],
            });
            if (applyCouponCode.__typename === 'Order') {
                setActiveOrder(applyCouponCode);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const removeCouponCode = async (code: string) => {
        try {
            const { removeCouponCode } = await storefrontApiMutation(getCtx())({
                removeCouponCode: [{ couponCode: code }, ActiveOrderSelector],
            });
            if (removeCouponCode?.id) setActiveOrder(removeCouponCode);
        } catch (e) {
            console.error(e);
        }
    };

    return {
        isLogged,
        activeOrder,
        cart: activeOrder,
        addToCart,
        setItemQuantityInCart,
        removeFromCart,
        fetchActiveOrder,
        applyCouponCode,
        removeCouponCode,
        isOpen,
        open,
        close,
    };
});

export const useCart = useCartContainer.useContainer;
export const CartProvider = useCartContainer.Provider;
