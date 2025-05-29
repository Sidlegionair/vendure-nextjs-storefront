import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TP, ContentContainer, Stack, Price, Link, Divider, TH2 } from '@/src/components/atoms';
import { FullWidthButton } from '@/src/components/molecules/Button';
import { NotifyMeForm } from '@/src/components/molecules/NotifyMeForm';
import { Layout } from '@/src/layouts';
import styled from '@emotion/styled';
import { ArrowRightIcon, ShoppingBasket } from 'lucide-react';
import { InferGetStaticPropsType } from 'next';
import { getStaticProps } from '@/src/components/pages/products/props';
import { ProductVariantTileType, productVariantTileSelector } from '@/src/graphql/selectors';
import { Trans, useTranslation } from 'next-i18next';
import { ProductOptions } from '@/src/components/organisms/ProductOptions';
import { Breadcrumbs } from '@/src/components/molecules';
import { useProduct } from '@/src/state/product';
import { ProductPhotosPreview } from '@/src/components/organisms/ProductPhotosPreview';
import { ProductTabs } from '@/src/components/molecules/ProductTabs';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { OptionTabContent } from '@/src/components/organisms/OptionTabContent';
import { ProductOptionTabs } from '@/src/components/molecules/ProductOptionTabs';
import { ProductStory } from '@/src/components/organisms/ProductStory';
import { Ratings } from '@/src/components/molecules/Ratings';
import { storefrontApiQuery } from '@/src/graphql/client';
import { useChannels } from '@/src/state/channels';
import { ProductSizingTable } from '@/src/components/molecules/ProductSizingTable';
import { HomePageSliders } from '@/src/components/organisms/HomePageSliders';
import { fetchChannels } from '@/src/lib/channels';

export const ProductPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    const { t } = useTranslation('products');
    const { t: breadcrumb } = useTranslation('common');
    const ctx = useChannels();
    const router = useRouter();

    const {
        product,
        variant,
        quantity,
        addingError,
        productOptionsGroups,
        handleOptionClick,
        // handleBuyNow is defined but not used in this component
        handleAddToCart,
        handleSetItemQuantityInCart,
    } = useProduct();

    // Load channels using fetchChannels (like in CartBody)
    interface Channel {
        slug: string;
        seller?: {
            name: string;
        };
    }
    const [channels, setChannels] = useState<Channel[]>([]);
    useEffect(() => {
        async function loadChannels() {
            const channelsData = await fetchChannels();
            setChannels(channelsData);
        }
        loadChannels();
    }, []);

    useEffect(() => {
        if (!variant) return;
        const checkVendorChannel = async () => {
            try {
                const { selectVendorForVariation } = await storefrontApiQuery(ctx)({
                    selectVendorForVariation: [
                        { productId: variant.id },
                        { slug: true, channel: true, sellerId: true },
                    ],
                });

                console.log('SELECTED CHANNEL', selectVendorForVariation);
                console.log('CUR CHANNEL', ctx.channel);
                // if the API suggests a different channel
                if (selectVendorForVariation?.slug && selectVendorForVariation.slug !== ctx.channel) {
                    // 1️⃣ update your channel context
                    ctx.setChannel(selectVendorForVariation.slug);

                    // 2️⃣ rebuild the path using Next’s locale
                    const variantQuery = variant.id ? `?variant=${variant.id}` : '';
                    router.replace(
                        `/${selectVendorForVariation.slug}/${ctx.locale}/snowboards/${product?.slug}${variantQuery}`,
                    );
                }
            } catch (error) {
                console.error('Error checking vendor channel', error);
            }
        };
        checkVendorChannel();
    }, [variant, ctx.channel, product?.slug, router, ctx]);

    if (!props.product || !product) {
        return (
            <Layout
                categories={props.collections ?? []}
                navigation={props.navigation ?? []}
                subnavigation={props.subnavigation ?? []}>
                <ContentContainer>
                    <Wrapper column>
                        <Stack w100 column gap={20}>
                            {/* Fallback UI */}
                        </Stack>
                    </Wrapper>
                </ContentContainer>
            </Layout>
        );
    }

    const breadcrumbs = [
        { name: breadcrumb('breadcrumbs.home'), href: '/' },
        { name: props.product.name, href: `/snowboards/${props.product.slug}` },
    ];

    // This state and effect are for tracking recently viewed products
    // Currently not used in the UI but kept for future implementation
    const [, setRecentlyProducts] = useState<ProductVariantTileType[]>([]);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const fetchData = async () => {
            try {
                const cookie = window.document.cookie.split('; ').find(row => row.startsWith('recentlyViewed'));
                if (!cookie) return;
                const recentlyViewed = cookie.split('=')[1].split(',');
                const { collection } = await storefrontApiQuery(ctx)({
                    collection: [
                        { slug: 'all' },
                        {
                            productVariants: [
                                { options: { filter: { id: { in: recentlyViewed } } } },
                                { items: productVariantTileSelector },
                            ],
                        },
                    ],
                });
                if (collection?.productVariants?.items.length) setRecentlyProducts(collection.productVariants.items);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [product.id, ctx]);

    // Product specifications - not currently used but kept for future implementation
    const rating = Math.random() * 5;

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation}>
            <ContentContainer>
                <Wrapper column>
                    <MobileHideWrapper>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </MobileHideWrapper>
                    <Main gap="15px">
                        <StickyLeft w100 itemsCenter justifyCenter gap="2rem">
                            <ProductPhotosPreview
                                featuredAsset={
                                    variant?.assets?.length
                                        ? {
                                              source: variant?.assets[0].source,
                                              preview: variant?.assets[0].preview,
                                          }
                                        : product.featuredAsset
                                          ? {
                                                source: product.featuredAsset.source,
                                                preview: product.featuredAsset.preview,
                                            }
                                          : undefined
                                }
                                images={[
                                    ...(variant?.assets?.map(a => ({
                                        source: a.source,
                                        preview: a.preview,
                                    })) ?? []),
                                    ...(product?.assets?.map(a => ({
                                        source: a.source,
                                        preview: a.preview,
                                    })) ?? []),
                                ]}
                                name={product.name}
                            />
                        </StickyLeft>
                        <ResponsiveRightColumn w100 column gap={10}>
                            <ProductInfoStack w100 column gap={15}>
                                <Stack column>
                                    {typeof product.customFields?.brand === 'string' && (
                                        <StyledBrand>{product.customFields.brand}</StyledBrand>
                                    )}
                                    <StyledProductTitle>{product.name}</StyledProductTitle>
                                </Stack>
                                <RatingStack itemsCenter gap={10}>
                                    <Ratings rating={rating} /> <b>Reviews:</b> 4.9
                                </RatingStack>
                                {variant && <Price price={variant.priceWithTax} currencyCode={variant.currencyCode} />}
                            </ProductInfoStack>
                            <Stack w100 gap="10px" column>
                                {variant && Number(variant?.stockLevel) > 0 && Number(variant?.stockLevel) <= 10 && (
                                    <MakeItQuick size="1rem" weight={500}>
                                        <Trans
                                            i18nKey="stock-levels.low-stock"
                                            t={t}
                                            values={{ value: variant?.stockLevel }}
                                            components={{ 1: <span></span> }}
                                        />
                                    </MakeItQuick>
                                )}
                                <StockInfo
                                    comingSoon={!variant}
                                    outOfStock={Number(variant?.stockLevel) <= 0}
                                    itemsCenter
                                    gap="0.25rem">
                                    <StockDisplay>
                                        <TP>
                                            {!variant ? null : Number(variant?.stockLevel) > 0 ? (
                                                <span>
                                                    <b>{variant?.stockLevel}</b> {t('stock-levels.left-in-stock')}
                                                </span>
                                            ) : (
                                                t('stock-levels.out-of-stock')
                                            )}
                                        </TP>
                                    </StockDisplay>
                                </StockInfo>
                                {(() => {
                                    const shortDescription = String(
                                        variant?.customFields?.shortdescription || product.description || '',
                                    );
                                    return shortDescription ? (
                                        <StyledDescription
                                            dangerouslySetInnerHTML={{ __html: shortDescription }}
                                            color="main"
                                        />
                                    ) : null;
                                })()}
                            </Stack>

                            <Stack w100 column>
                                <ProductOptionTabs
                                    defaultOpenIndex={0}
                                    data={[
                                        {
                                            title: 'Size & Color',
                                            children: (
                                                <ProductOptions
                                                    productOptionsGroups={productOptionsGroups}
                                                    handleClick={handleOptionClick}
                                                    addingError={addingError}
                                                />
                                            ),
                                        },
                                        ...(variant?.customFields
                                            ? Array.from({ length: 4 }, (_, i) => i + 1)
                                                  .filter(tabIndex => {
                                                      type CustomFields = {
                                                          [key: `optionTab${number}Visible`]: boolean;
                                                          [key: `optionTab${number}Label`]: string;
                                                      };
                                                      return (variant?.customFields as CustomFields)[
                                                          `optionTab${tabIndex}Visible`
                                                      ];
                                                  })
                                                  .map(tabIndex => {
                                                      type CustomFields = {
                                                          [key: `optionTab${number}Label`]: string;
                                                      };
                                                      return {
                                                          title:
                                                              (variant?.customFields as CustomFields)[
                                                                  `optionTab${tabIndex}Label`
                                                              ] || `Option Tab ${tabIndex}`,
                                                          children: (
                                                              <OptionTabContent
                                                                  customFields={variant?.customFields}
                                                                  tabIndex={tabIndex}
                                                              />
                                                          ),
                                                      };
                                                  })
                                            : []),
                                    ]}
                                />
                            </Stack>
                            {/* Replace the "FREE SHIPPING" section with an unstyled shipping details table */}
                            <StyledDividerTop />
                            <ShippingTable>
                                <tbody>
                                    <tr>
                                        <td>Standard shipping</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Delivery time</td>
                                        <td>2-3 days</td>
                                    </tr>
                                    <tr>
                                        <td>Sold &amp; shipped by:</td>
                                        <td>
                                            <StyledLink skipChannelHandling href={`/content/partners/${ctx?.channel}`}>
                                                {channels.find(ch => ch.slug === ctx.channel)?.seller?.name ||
                                                    'Seller not found'}
                                            </StyledLink>
                                        </td>
                                    </tr>
                                </tbody>
                            </ShippingTable>

                            <StyledDividerTop />
                            {!variant ? null : Number(variant?.stockLevel) <= 0 ? (
                                <NotifyMeForm />
                            ) : (
                                <ResponsiveActionRow gap={20}>
                                    <QuantityCounter
                                        size="14px"
                                        height="56px"
                                        v={quantity}
                                        onChange={v => handleSetItemQuantityInCart(v)}
                                    />
                                    <StyledFullWidthButton onClick={handleAddToCart}>
                                        <ShoppingBasket />
                                        {t('add-to-cart')}
                                        <ArrowRightIcon />
                                    </StyledFullWidthButton>
                                </ResponsiveActionRow>
                            )}
                        </ResponsiveRightColumn>
                    </Main>

                    <Stack w100>
                        <ProductTabs
                            defaultOpenIndex={0}
                            data={[
                                ...(variant?.customFields
                                    ? Array.from({ length: 3 }, (_, i) => i + 1)
                                          .filter(tabIndex => {
                                              type CustomFields = {
                                                  [key: `descriptionTab${number}Visible`]: boolean;
                                              };
                                              return (variant?.customFields as CustomFields)[
                                                  `descriptionTab${tabIndex}Visible`
                                              ];
                                          })
                                          .map(tabIndex => {
                                              type CustomFields = {
                                                  [key: `descriptionTab${number}Label`]: string;
                                                  [key: `descriptionTab${number}Content`]: string;
                                              };
                                              return {
                                                  title:
                                                      (variant?.customFields as CustomFields)[
                                                          `descriptionTab${tabIndex}Label`
                                                      ] || `Description Tab ${tabIndex}`,
                                                  children: (
                                                      <div
                                                          dangerouslySetInnerHTML={{
                                                              __html:
                                                                  (variant?.customFields as CustomFields)[
                                                                      `descriptionTab${tabIndex}Content`
                                                                  ] || 'No content available',
                                                          }}
                                                      />
                                                  ),
                                              };
                                          })
                                    : []),
                                {
                                    title: 'Specifications',
                                    children: <ProductSizingTable product={product} fields={fields} />,
                                },
                                {
                                    title: 'Reviews',
                                    children: (
                                        <Stack>
                                            <p>No reviews yet. Be the first to review this product!</p>
                                        </Stack>
                                    ),
                                },
                            ]}
                        />
                    </Stack>
                </Wrapper>
                <Stack w100 column gap={20}>
                    <StyledBoughtHeading>{t('clients-also-bought')}</StyledBoughtHeading>
                    <StyledBoughtContent>
                        Aenean faucibus egestas ipsum, nec consequat urna fermentum sit amet. Ut scelerisque elit in leo
                        hendrerit, pretium ultricies nisi euismod.
                    </StyledBoughtContent>
                </Stack>
            </ContentContainer>
            <HomePageSliders useVariants={true} sliders={props.clientsAlsoBought} />
            <ProductStory slug={props.product.slug} />
        </Layout>
    );
};

const fields = [
    { key: 'boardWidth', label: 'Board Width (cm)' },
    { key: 'riderLengthMin', label: 'Rider Length Min (cm)' },
    { key: 'riderLengthMax', label: 'Rider Length Max (cm)' },
    { key: 'riderWeightMin', label: 'Rider Weight Min (kg)' },
    { key: 'riderWeightMax', label: 'Rider Length Max (cm)' },
    { key: 'bootLengthMax', label: 'Boot Length Max (cm)' },
    { key: 'flex', label: 'Flex' },
    { key: 'noseWidth', label: 'Nose Width (cm)' },
    { key: 'waistWidth', label: 'Waist Width (cm)' },
    { key: 'tailWidth', label: 'Tail Width (cm)' },
    { key: 'taper', label: 'Taper (cm)' },
    { key: 'effectiveEdge', label: 'Effective Edge (cm)' },
    { key: 'averageSidecutRadius', label: 'Average Sidecut Radius (m)' },
    { key: 'setback', label: 'Setback (cm)' },
    { key: 'stanceMin', label: 'Stance Min (cm)' },
    { key: 'stanceMax', label: 'Stance Max (cm)' },
    { key: 'weightKg', label: 'Weight (kg)' },
    { key: 'bindingSizeVariant', label: 'Binding Size' },
];

const RatingStack = styled(Stack)`
    font-family: "Suisse BP Int'l light", sans-serif;
    font-size: 18px;
`;

const ShippingTable = styled.table`
    font-family: "Suisse BP Int'l", sans-serif;
    td {
        padding: 0.5rem 1rem;
    }
`;

const StyledLink = styled(Link)`
    font-family: "Suisse BP Int'l", sans-serif;
    color: ${p => p.theme.text.accent};
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
        color: ${p => p.theme.text.accent};
        text-decoration: underline;
    }

    display: flex;
    align-items: start;
`;

const StyledBoughtHeading = styled(TH2)`
    margin-top: 60px;
    font-size: 38px;
    line-height: 38px;
    font-weight: 600;
    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 30px;
        line-height: 30px;
    }
`;

const StyledBoughtContent = styled('p')`
    font-size: 20px;
    line-height: 26px;
    color: ${p => p.theme.text.subtitle};
    @media (max-width: 767px) {
        font-size: 18px;
        line-height: 26px;
    }
`;

const StyledDescription = styled(Stack)`
    flex-direction: column;
    gap: 15px;
`;

const Wrapper = styled(Stack)`
    padding-top: 2rem;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        padding: 3.5rem 0;
    }
`;

const MobileHideWrapper = styled.div`
    @media (max-width: 767px) {
        display: none;
    }
`;

const StyledBrand = styled.h4`
    font-weight: bold;
`;

const StyledProductTitle = styled.h4``;

const Main = styled(Stack)`
    padding: 1.5rem 0;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.gray(100)};
    margin-bottom: 2rem;
    @media (min-width: 768px) {
        flex-direction: row;
        padding: 2rem 0;
    }
    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        padding: 4rem 0;
    }
`;

const StickyLeft = styled(Stack)`
    width: 100%;
    @media (min-width: 1024px) {
        position: sticky;
        top: 12rem;
        width: 60%;
    }
`;

const ResponsiveRightColumn = styled(Stack)`
    width: 100%;
    gap: 2rem;
    @media (min-width: 1024px) {
        width: 60%;
        align-items: flex-start;
    }
`;

const ProductInfoStack = styled(Stack)`
    border-bottom: 2px solid ${({ theme }) => theme.gray(100)};
    width: 100%;
`;

const MakeItQuick = styled(TP)`
    font-size: 18px;
    color: ${({ theme }) => theme.error};
`;

const StockInfo = styled(Stack)<{ outOfStock?: boolean; comingSoon?: boolean }>`
    white-space: nowrap;
    color: ${p => (p.outOfStock ? p.theme.error : p.comingSoon ? p.theme.gray(800) : 'inherit')};
    width: 100%;
    flex-wrap: wrap;
`;

const StyledDividerTop = styled(Divider)`
    background-color: ${p => p.theme.border.thin};
    height: 1px;
    width: 100%;
`;

const ResponsiveActionRow = styled(Stack)`
    width: 100%;
    flex-direction: column;
    @media (min-width: 480px) {
        flex-direction: row;
    }
`;

const StyledFullWidthButton = styled(FullWidthButton)`
    background: ${({ theme }) => theme.background.accentGreen};
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    text-transform: uppercase;
    padding: 1.5rem;
    justify-content: center;
    transition:
        background 250ms ease-in-out,
        transform 200ms ease-in-out,
        box-shadow 250ms ease-in-out;
    svg {
        flex-shrink: 0;
    }
    &:hover {
        color: white;
        background: ${({ theme }) => theme.background.accentGreen};
        transform: scale(1.03);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    &:active {
        transform: scale(0.98);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }
`;

const StockDisplay = styled(Stack)`
    font-weight: 400;
    gap: 3px;
    b {
        color: ${({ theme }) => theme.text.accentGreen};
        font-weight: 700;
    }
`;
