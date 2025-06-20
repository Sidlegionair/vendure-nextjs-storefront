import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { ProductImage } from '@/src/components/atoms/ProductImage';
import { ActiveOrderType, OrderType } from '@/src/graphql/selectors';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { Price } from '@/src/components/atoms/Price';
import { useCheckout } from '@/src/state/checkout';
import { Stack } from '@/src/components/atoms/Stack';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { CurrencyCode } from '@/src/zeus';
import { fetchChannels } from '@/src/lib/channels';
import { Link } from '@/src/components/atoms/Link';
import { getServiceLocationForProduct } from '@/src/graphql/sharedQueries';
import { ServiceLocationType } from '@/src/graphql/selectors';
import { useChannels } from '@/src/state/channels';
import { DEFAULT_CHANNEL, DEFAULT_LOCALE } from '@/src/lib/consts';

// Define a type for channel data
interface Channel {
    slug: string;
    seller?: {
        name: string;
    };
}

interface LineProps {
    line: ActiveOrderType['lines'][number] | OrderType['lines'][number];
    isForm?: boolean;
    currencyCode?: CurrencyCode;
}

export const Line: React.FC<LineProps> = ({ isForm, line, currencyCode = CurrencyCode.USD }) => {
    const {
        id,
        productVariant,
        quantity,
        featuredAsset,
        unitPriceWithTax,
        linePriceWithTax,
        discountedLinePriceWithTax,
    } = line;
    // Instead of destructuring customFields here, we access it later
    const customFields = (line as { customFields?: { requestedSellerChannel?: string; brand?: string } }).customFields;
    const { t } = useTranslation('checkout');
    const { removeFromCheckout, changeQuantity } = useCheckout();

    // Fetch channels as in CartBody
    const [channels, setChannels] = useState<Channel[]>([]);
    const [serviceLocation, setServiceLocation] = useState<ServiceLocationType | null>(null);
    const [loadingServiceLocation, setLoadingServiceLocation] = useState(false);

    useEffect(() => {
        async function loadChannels() {
            const channelsData = await fetchChannels();
            setChannels(channelsData);
        }
        loadChannels();
    }, []);

    // Get channel and locale from context
    const ctx = useChannels();

    // Fetch service location data
    useEffect(() => {
        async function loadServiceLocation() {
            // Check if productVariant has an id property using 'in' operator
            if (productVariant && 'id' in productVariant && productVariant.id) {
                setLoadingServiceLocation(true);
                try {
                    // Use the channel and locale from context with fallbacks to defaults
                    const locale = ctx?.locale ?? DEFAULT_LOCALE;
                    const channel = ctx?.channel ?? DEFAULT_CHANNEL;

                    const serviceLocationData = await getServiceLocationForProduct(
                        { locale, channel },
                        productVariant.id,
                    );
                    setServiceLocation(serviceLocationData);
                } catch (error) {
                    console.error('Error loading service location:', error);
                } finally {
                    setLoadingServiceLocation(false);
                }
            }
        }
        loadServiceLocation();
    }, [productVariant]);

    // Determine the seller name using the requestedSellerChannel from customFields
    const requestedSellerChannel = customFields?.requestedSellerChannel;
    const sellerName = channels.find(ch => ch.slug === requestedSellerChannel)?.seller?.name || 'Unknown Seller';

    const isPriceDiscounted = linePriceWithTax !== discountedLinePriceWithTax;
    const optionInName = productVariant.name.replace(productVariant.product.name, '') !== '';

    return (
        <CartRow w100 justifyBetween>
            <Stack gap="2rem">
                <ProductImageWrapper>
                    <ProductImage
                        src={featuredAsset?.preview}
                        alt={productVariant.product.name}
                        title={productVariant.product.name}
                    />
                </ProductImageWrapper>
                <Stack column gap="18px">
                    <Stack column gap="0.125rem">
                        <Stack gap="0.5rem">
                            {customFields?.brand && (
                                <TP size="18px" weight={700}>
                                    {customFields.brand}
                                </TP>
                            )}
                        </Stack>
                        <Stack gap="5px">
                            <TP size="18px" weight={300} noWrap>
                                {productVariant.product.name}
                            </TP>
                            {optionInName && (
                                <TP size="18px" weight={300} noWrap>
                                    {productVariant.name.replace(productVariant.product.name, '')}
                                </TP>
                            )}
                        </Stack>
                    </Stack>
                    {isForm && (
                        <Stack column gap="18px">
                            <QuantityCounter v={quantity} onChange={(v: number) => changeQuantity(id, v)} />
                            <Stack>
                                <Remove onClick={() => removeFromCheckout(id)}>
                                    <Trash2 size="16px" />
                                    <RemoveText weight={400} size="16px">
                                        {t('orderSummary.remove')}
                                    </RemoveText>
                                </Remove>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            <Stack column itemsEnd gap="10px">
                <Price
                    inCart={true}
                    weight={500}
                    currencyCode={currencyCode}
                    price={unitPriceWithTax}
                    discountPrice={isPriceDiscounted ? discountedLinePriceWithTax / quantity : undefined}
                    quantity={quantity}
                />
                <Stack column gap="5px">
                    {/* Display the seller's name with same styling and position as in CartBody */}
                    <StyledTP size="16px" weight={500}>
                        Sold by{' '}
                        <StyledLink skipChannelHandling href={`/content/partners/${requestedSellerChannel}`}>
                            {sellerName}
                        </StyledLink>
                    </StyledTP>

                    {/* Display service location information if available */}
                    {loadingServiceLocation ? (
                        <StyledTP size="16px" weight={500}>
                            Loading service information...
                        </StyledTP>
                    ) : serviceLocation && serviceLocation.serviceDealer ? (
                        <StyledTP size="16px" weight={500}>
                            Service by{' '}
                            <StyledLink
                                skipChannelHandling
                                href={`/content/partners/${serviceLocation.serviceDealer.slug}`}>
                                {serviceLocation.serviceDealer.name}
                            </StyledLink>
                        </StyledTP>
                    ) : null}
                </Stack>
            </Stack>
        </CartRow>
    );
};

/* --- Styled Components --- */
const CartRow = styled(Stack)`
    padding: 2rem 0;
    border-bottom: 1px solid ${p => p.theme.withOpacity(p.theme.border.main, 0.3)};
`;

const ProductImageWrapper = styled.div`
    height: 250px;
    overflow: hidden;
    border-radius: 4px;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
`;

const Remove = styled.button`
    appearance: none;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    width: fit-content;
    color: ${p => p.theme.text.accent};
    gap: 0.4rem;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const RemoveText = styled(TP)`
    color: ${p => p.theme.text.accent};
`;

const StyledTP = styled(TP)`
    display: flex;
    gap: 5px;
    color: #bbbbbb;
`;

const StyledLink = styled(Link)`
    font-family: "Suisse BP Int'l", sans-serif;
    color: #bbbbbb;
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
        color: ${p => p.theme.text.accent};
        text-decoration: underline;
    }

    display: flex;
    align-items: start;
`;
