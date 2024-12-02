import React, { useEffect, useState } from 'react';

import { TH1, TP, ContentContainer, Stack, Price, Link, Divider, TH2 } from '@/src/components/atoms';
import { FullWidthButton, FullWidthSecondaryButton } from '@/src/components/molecules/Button';
import { NotifyMeForm } from '@/src/components/molecules/NotifyMeForm';
import { ProductPageProductsSlider } from '@/src/components/organisms/ProductPageProductsSlider';
import { Layout } from '@/src/layouts';
import styled from '@emotion/styled';
import { ArrowRightIcon, ShoppingBasket } from 'lucide-react';
import { InferGetStaticPropsType } from 'next';

import { Trans, useTranslation } from 'next-i18next';
import { ProductOptions } from '@/src/components/organisms/ProductOptions';
import { Breadcrumbs } from '@/src/components/molecules';
import { useProduct } from '@/src/state/product';
import { ProductPhotosPreview } from '@/src/components/organisms/ProductPhotosPreview';
import { getStaticProps } from '@/src/components/pages/products/props';
import { storefrontApiQuery } from '@/src/graphql/client';
import { useChannels } from '@/src/state/channels';
import { ProductVariantTileType, productVariantTileSelector } from '@/src/graphql/selectors';
import { ProductTabs } from '@/src/components/molecules/ProductTabs';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { OptionTabContent } from '@/src/components/organisms/OptionTabContent';
import { ProductOptionTabs } from '@/src/components/molecules/ProductOptionTabs';
import { ProductStory } from '@/src/components/organisms/ProductStory';
import { Ratings } from '@/src/components/molecules/Ratings';

export const ProductPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    const { t } = useTranslation('products');
    const { t: breadcrumb } = useTranslation('common');
    const ctx = useChannels();
    const {
        product,
        variant,
        quantity,
        addingError,
        productOptionsGroups,
        handleOptionClick,
        handleBuyNow,
        handleAddToCart,
        handleSetItemQuantityInCart
    } = useProduct();

    const breadcrumbs = [
        { name: breadcrumb('breadcrumbs.home'), href: '/' },
        { name: props.product.name, href: `/products/${props.product.slug}` },
    ];

    const [recentlyProducts, setRecentlyProducts] = useState<ProductVariantTileType[]>([]);

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
    }, [product?.id]);

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation}>
            <ContentContainer>
                <Wrapper column>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    <Main gap="5rem">
                        <StickyLeft w100 itemsCenter justifyCenter gap="2.5rem">
                            <ProductPhotosPreview
                                featuredAsset={product?.featuredAsset}
                                images={product?.assets}
                                name={product?.name}
                            />
                        </StickyLeft>
                        <StyledStack w100 column>
                            <ProductInfoStack w100 column gap={30}>
                                <Stack gap={15}>
                                    {typeof product?.customFields?.brand === 'string' && (
                                        <TH1 size="35px" weight={700} noWrap>
                                            {product.customFields.brand}
                                        </TH1>
                                    )}

                                    <TH1 weight={300} size="35px">{product?.name}</TH1>
                                </Stack>
                                <Ratings rating={Math.random() * 5} />

                                {variant && <Price size="40px" price={variant.priceWithTax} currencyCode={variant.currencyCode} />}
                            </ProductInfoStack>
                            <Stack w100 gap="1rem" column>
                                {variant && Number(variant.stockLevel) > 0 && Number(variant.stockLevel) <= 10 && (
                                    <MakeItQuick size="1.5rem" weight={500}>
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
                                    gap="0.25rem"
                                >
                                    <StockDisplay>
                                        <TP>
                                            {!variant
                                                ? null
                                                : Number(variant.stockLevel) > 0
                                                    ? (
                                                        <span>
                                                            <b>{variant.stockLevel}</b> {t('stock-levels.left-in-stock')}
                                                        </span>
                                                    )
                                                    : t('stock-levels.out-of-stock')}
                                        </TP>
                                    </StockDisplay>
                                </StockInfo>
                                <TP color="main" size="16px" lineHeight="24px" style={{ marginTop: '1.5rem' }}>
                                    {product?.description}
                                </TP>
                            </Stack>

                            <Stack w100>
                                {/* Product Options Section with Tabs */}
                                <ProductOptionTabs
                                    defaultOpenIndex={0} // Default to the first tab
                                    data={[
                                        // Tab for Product Options
                                        {
                                            title: 'Product Options',
                                            children: (
                                                <ProductOptions
                                                    productOptionsGroups={productOptionsGroups}
                                                    handleClick={handleOptionClick}
                                                    addingError={addingError}
                                                />
                                            ),
                                        },
                                        // Additional Option Tabs
                                        ...(variant?.customFields
                                            ? Array.from({ length: 3 }, (_, i) => i + 1) // MAX_OPTION_TABS = 3
                                                .filter(tabIndex => (variant.customFields as Record<string, any>)[`optionTab${tabIndex}Visible`])
                                                .map(tabIndex => ({
                                                    title: (variant.customFields as Record<string, any>)[`optionTab${tabIndex}Label`] || `Option Tab ${tabIndex}`,
                                                    children: (
                                                        <OptionTabContent
                                                            customFields={variant.customFields}
                                                            tabIndex={tabIndex}
                                                        />
                                                    ),
                                                }))
                                            : []),
                                    ]}
                                />
                            </Stack>
                            <StyledDividerTop></StyledDividerTop>
                            <Stack justifyBetween>
                                <TP weight={700} size={18}>FREE SHIPPING</TP>
                            </Stack>
                            <StyledDividerTop></StyledDividerTop>
                            {!variant ? null : Number(variant.stockLevel) <= 0 ? (
                                <NotifyMeForm />
                            ) : (
                                <Stack gap={20} justifyBetween>
                                    <QuantityCounter
                                        size="14px"
                                        height="56px"
                                        v={quantity}
                                        onChange={v => handleSetItemQuantityInCart(v)}
                                    />
                                    <StyledFullWidthButton
                                        style={{ display: 'flex', alignItems: 'center', gap: '15px', textTransform: 'uppercase', padding: '1.5rem' }}
                                        onClick={handleAddToCart}>
                                        <ShoppingBasket />{t('add-to-cart')}<ArrowRightIcon />
                                    </StyledFullWidthButton>
                                </Stack>
                            )}
                        </StyledStack>
                    </Main>

                    {/* Description Tabs Section */}
                    <Stack w100>
                        <ProductTabs
                            defaultOpenIndex={0} // Default to the first tab
                            data={[
                                // Description Tabs
                                ...(variant?.customFields
                                    ? Array.from({ length: 3 }, (_, i) => i + 1) // MAX_DESCRIPTION_TABS = 3
                                        .filter(tabIndex => (variant.customFields as Record<string, any>)[`descriptionTab${tabIndex}Visible`])
                                        .map(tabIndex => ({
                                            title: (variant.customFields as Record<string, any>)[`descriptionTab${tabIndex}Label`] || `Description Tab ${tabIndex}`,
                                            children: (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: (variant.customFields as Record<string, any>)[`descriptionTab${tabIndex}Content`] || 'No content available',
                                                    }}
                                                />
                                            ),
                                        }))
                                    : []),
                                // Default Reviews Tab
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
                    <TH2>{t('clients-also-bought')}</TH2>
                    <TP>Aenean faucibus egestas ipsum, nec consequat urna fermentum sit amet. Ut scelerisque elit in leo hendrerit, pretium ultricies nisi euismod.</TP>
                </Stack>
            </ContentContainer>
            <ProductPageProductsSlider title={t('recently-viewed')}
                products={props.clientsAlsoBought?.collection?.productVariants?.items ?? []}
            />
            <ProductPageProductsSlider title={t('recently-viewed')} products={recentlyProducts ?? []} />
            <ProductStory slug={props.product.slug} />

        </Layout>
    );
};


// Styled Components (Unchanged)
const CategoryBlock = styled(Link)`
    width: fit-content;
`;

const ProductInfoStack = styled(Stack)`
    border-bottom: 2px solid ${({ theme }) => theme.gray(100)};
`;

const Wrapper = styled(Stack)`
    padding-top: 2rem;
    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        padding: 3.5rem 0;
    }
`;

const MakeItQuick = styled(TP)`
    color: ${({ theme }) => theme.error};
`;

const StickyLeft = styled(Stack)`
    @media (min-width: 1024px) {
        position: sticky;
        top: 12rem;
    }
`;

const StockInfo = styled(Stack)<{ outOfStock?: boolean; comingSoon?: boolean }>`
    white-space: nowrap;
    color: ${p => (p.outOfStock ? p.theme.error : p.comingSoon ? p.theme.gray(800) : 'inherit')};
    width: max-content;
    @media (min-width: 1024px) {
        width: 100%;
    }
`;

const StyledTabDivider = styled(Divider)`
    background-color: ${p => p.theme.border.thin};
    height: 1px;
    mix-blend-mode: normal;
    margin-top: 25px;
    margin-bottom: 25px;
`;

const StyledDividerTop = styled(Divider)`
    background-color: ${p => p.theme.border.thin};
    height: 1px;
    mix-blend-mode: normal;
    margin-top: 25px;
    margin-bottom: 25px;
`;

const StyledStack = styled(Stack)`
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
        align-items: flex-start;
    }
`;

const StyledFullWidthButton = styled(FullWidthButton)`
    background: ${({ theme }) => theme.background.accentGreen};
    color: white;
    border-radius: 12px;
`;

const Main = styled(Stack)`
    padding: 1.5rem 0;
    flex-direction: column;
    align-items: start;
    @media (min-width: 1024px) {
        flex-direction: row;
        padding: 4rem 0;
    }
    margin-bottom: 2rem;
    border-bottom: 1px solid ${({ theme }) => theme.gray(100)};
`;

const StockDisplay = styled(Stack)`
    font-size: 18px;
    font-weight: 400;
    gap: 3px;
    margin-top: 20px;

    b {
        color: ${({ theme }) => theme.text.accentGreen};
        font-weight: 700;
    }
`;
