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

    // Merge the context with default values (fallbacks)
    const getCtx = () => ({
        channel: (ctx && ctx.channel) || DEFAULT_CHANNEL,
        locale: (ctx && ctx.locale) || DEFAULT_LOCALE,
        ...(ctx || {}),
    });

    const fetchActiveOrder = async () => {
        try {
            const mergedCtx = getCtx();
            const [{ activeOrder }, { activeCustomer }] = await Promise.all([
                storefrontApiQuery(mergedCtx)({ activeOrder: ActiveOrderSelector }),
                storefrontApiQuery(mergedCtx)({ activeCustomer: { id: true } }),
            ]);
            console.log('Fetched activeOrder:', activeOrder);
            setActiveOrder(activeOrder);
            setIsLogged(!!activeCustomer?.id);
            return activeOrder;
        } catch (e) {
            console.log(e);
        }
    };

    // Wait until ctx is available, then fetch cart data.
    useEffect(() => {
        if (ctx !== undefined) {
            console.log('MOUNTED CART with ctx:', getCtx());
            fetchActiveOrder();
        }
    }, [ctx]);

    // Refresh the cart when the page becomes visible.
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchActiveOrder();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () =>
            document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [ctx]);

    const addToCart = async (id: string, q: number, o?: boolean) => {
        // Optimistically update local state.
        setActiveOrder(c => (c ? { ...c, totalQuantity: c.totalQuantity + 1 } : c));
        try {
            const { addItemToOrder } = await storefrontApiMutation(getCtx())({
                addItemToOrder: [
                    {
                        productVariantId: id,
                        quantity: q,
                        customFields: { requestedSellerChannel: getCtx().channel },
                    },
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
                if (o) open();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const removeFromCart = async (id: string) => {
        // Optimistically remove from local state.
        setActiveOrder(c => (c ? { ...c, lines: c.lines.filter(l => l.id !== id) } : c));
        try {
            const { removeOrderLine } = await storefrontApiMutation(getCtx())({
                removeOrderLine: [
                    { orderLineId: id },
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
            console.log(e);
        }
    };

    const setItemQuantityInCart = async (id: string, q: number) => {
        // Optimistically update local state.
        setActiveOrder(c => {
            if (c?.lines.find(l => l.id === id)) {
                return { ...c, lines: c.lines.map(l => (l.id === id ? { ...l, q } : l)) };
            }
            return c;
        });
        try {
            const { adjustOrderLine } = await storefrontApiMutation(getCtx())({
                adjustOrderLine: [
                    { orderLineId: id, quantity: q },
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
            console.log(e);
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
            console.log(e);
            return false;
        }
    };

    const removeCouponCode = async (code: string) => {
        try {
            const { removeCouponCode } = await storefrontApiMutation(getCtx())({
                removeCouponCode: [{ couponCode: code }, ActiveOrderSelector],
            });
            if (removeCouponCode?.id) {
                setActiveOrder(removeCouponCode);
            }
        } catch (e) {
            console.log(e);
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
