import React, { useEffect, useState } from 'react';

import { TH1, TP, ContentContainer, Stack, Price, Link, Divider, TH2 } from '@/src/components/atoms';
import { FullWidthButton, FullWidthSecondaryButton } from '@/src/components/molecules/Button';
import { NotifyMeForm } from '@/src/components/molecules/NotifyMeForm';
import { ProductPageProductsSlider } from '@/src/components/organisms/ProductPageProductsSlider';
// import { ProductPhotosPreview } from '@/src/components/organisms/ProductPhotosPreview';
import { Layout } from '@/src/layouts';
import styled from '@emotion/styled';
import { ArrowRight, ArrowRightIcon, Check, ShoppingBasket, ShoppingCartIcon, X } from 'lucide-react';
import { InferGetStaticPropsType } from 'next';

import { Trans, useTranslation } from 'next-i18next';
import { ProductOptions } from '@/src/components/organisms/ProductOptions';
import { Breadcrumbs } from '@/src/components/molecules';
import { useProduct } from '@/src/state/product';
import { ProductPhotosPreview } from '@/src/components/organisms/ProductPhotosPreview';
import { getStaticProps } from '@/src/components/pages/products/props';
import { ProductDescription } from '@/src/components/molecules/ProductDescription';
import { storefrontApiQuery } from '@/src/graphql/client';
import { useChannels } from '@/src/state/channels';
import { ProductVariantTileType, productVariantTileSelector } from '@/src/graphql/selectors';
import { ProductTabs } from '@/src/components/molecules/ProductTabs';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';

export const ProductPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    const { t } = useTranslation('products');
    const { t: breadcrumb } = useTranslation('common');
    const ctx = useChannels();
    const { product, variant, quantity, addingError, productOptionsGroups, handleOptionClick, handleBuyNow, handleAddToCart, handleSetItemQuantityInCart } =
        useProduct();

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
        <Layout categories={props.collections} navigation={props.navigation}>
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
                                {/*{product?.collections*/}
                                {/*    .filter(c => c.slug !== 'all' && c.slug !== 'search')*/}
                                {/*    .sort(() => -1)*/}
                                {/*    .slice(0, 1)*/}
                                {/*    .map(c => {*/}
                                {/*        const href =*/}
                                {/*            c.parent?.slug !== '__root_collection__'*/}
                                {/*                ? `/collections/${c.parent?.slug}/${c.slug}`*/}
                                {/*                : `/collections/${c.slug}`;*/}
                                {/*        return (*/}
                                {/*            <CategoryBlock href={href} key={c.slug}>*/}
                                {/*                <TP*/}
                                {/*                    size="1.25rem"*/}
                                {/*                    color="subtitle"*/}
                                {/*                    upperCase*/}
                                {/*                    weight={500}*/}
                                {/*                    style={{ letterSpacing: '0.5px' }}>*/}
                                {/*                    {c.name}*/}
                                {/*                </TP>*/}
                                {/*            </CategoryBlock>*/}
                                {/*        );*/}
                                {/*    })}*/}

                                <Stack gap={15}>
                                    {product?.customFields?.brand === 'string' && (
                                        <TH1 size="35px" weight={700} noWrap>
                                            {product?.customFields?.brand}
                                        </TH1>
                                    )}

                                    <TH1 weight={300} size="35px">{product?.name}</TH1>
                                </Stack>
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
                                <TP color="main" style={{ marginTop: '1.5rem' }}>
                                    {product?.description}
                                </TP>
                            </Stack>





                            <StyledDivider></StyledDivider>
                            <Stack w100>
                                {product && product.variants.length > 1 ? (
                                    <ProductOptions
                                        productOptionsGroups={productOptionsGroups}
                                        handleClick={handleOptionClick}
                                        addingError={addingError}
                                    />
                                ) : null}
                            </Stack>
                            <StyledDivider></StyledDivider>
                            <Stack justifyBetween>
                                <TP weight={700} size={18}>FREE SHIPPING</TP>
                            </Stack>
                            <StyledDivider></StyledDivider>
                            {!variant ? null : Number(variant.stockLevel) <= 0 ? (
                                <NotifyMeForm />
                            ) : (
                                <Stack gap="2.5rem" justifyBetween>
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
                                    {/*<FullWidthSecondaryButton*/}
                                    {/*    style={{ textTransform: 'uppercase', padding: '1.5rem' }}*/}
                                    {/*    onClick={handleBuyNow}>*/}
                                    {/*    {t('buy-now')}*/}
                                    {/*</FullWidthSecondaryButton>*/}
                                </Stack>
                            )}
                            {/*<ProductDescription*/}
                            {/*    defaultOpenIndexes={[1]}*/}
                            {/*    data={[*/}
                            {/*        {*/}
                            {/*            title: t('details'),*/}
                            {/*            children: (*/}
                            {/*                <Stack column style={{ marginTop: '1.5rem' }}>*/}
                            {/*                    <Stack>*/}
                            {/*                        <TP color="subtitle">{t('sku')}</TP>*/}
                            {/*                        <TP color="subtitle">&nbsp;{variant?.sku}</TP>*/}
                            {/*                    </Stack>*/}
                            {/*                    {variant?.options.length ? (*/}
                            {/*                        <Stack column>*/}
                            {/*                            {variant?.options.map(option => (*/}
                            {/*                                <Stack key={option.code}>*/}
                            {/*                                    <TP color="subtitle">{option.name}</TP>*/}
                            {/*                                </Stack>*/}
                            {/*                            ))}*/}
                            {/*                        </Stack>*/}
                            {/*                    ) : null}*/}
                            {/*                </Stack>*/}
                            {/*            ),*/}
                            {/*        },*/}
                            {/*        {*/}
                            {/*            title: t('description'),*/}
                            {/*            children: (*/}
                            {/*                <TP color="subtitle" style={{ marginTop: '1.5rem' }}>*/}
                            {/*                    {product?.description}*/}
                            {/*                </TP>*/}
                            {/*            ),*/}
                            {/*        },*/}
                            {/*    ]}*/}
                            {/*/>*/}
                        </StyledStack>
                    </Main>
                    <Stack>
                        <Stack w100>
                            <ProductTabs
                                defaultOpenIndex={0} // Set the default open tab (index 0)
                                data={[
                                    // Dynamically generated tabs from customFields
                                    ...(variant?.customFields
                                        ? Array.from({ length: 10 }, (_, i) => i + 1)
                                            .filter(tabIndex => (variant.customFields as Record<string, any>)[`tab${tabIndex}Visible`])
                                            .map(tabIndex => ({
                                                title: (variant.customFields as Record<string, any>)[`tab${tabIndex}Label`] || `Tab ${tabIndex}`,
                                                children: (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: (variant.customFields as Record<string, any>)[`tab${tabIndex}Content`] || 'No content available',
                                                        }}
                                                    />
                                                ),
                                            }))
                                        : []),


                                    // Default Reviews tab
                                    {
                                        title: 'Reviews',
                                        children: (
                                            <Stack>
                                                {/* Render your reviews component or content here */}
                                                <p>No reviews yet. Be the first to review this product!</p>
                                            </Stack>
                                        ),
                                    },
                                ]}
                            />
                        </Stack>
                    </Stack>

                    <ProductPageProductsSlider
                        title={t('clients-also-bought')}
                        products={props.clientsAlsoBought?.collection?.productVariants?.items ?? []}
                    />
                    <ProductPageProductsSlider title={t('recently-viewed')} products={recentlyProducts ?? []} />
                </Wrapper>
            </ContentContainer>
        </Layout>
    );
};

const CategoryBlock = styled(Link)`
    width: fit-content;
`;

const ProductInfoStack = styled(Stack)`
    border-bottom: 2px solid ${({ theme }) => theme.gray(100)};
    //padding-bottom: 7.5rem;
// `;

const Wrapper = styled(Stack)`
    padding-top: 2rem;
    @media (min-width: ${p => p.theme.breakpoints.xl}) {
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



const StyledDivider = styled(Divider) `
    background-color: ${p => p.theme.border.main};
    height: 1px;
    mix-blend-mode: normal;
    margin-top: 25px;
    margin-bottom: 25px;
`

const StyledStack = styled(Stack)`
    //border: 1px solid #4D4D4D;
    border-radius: 15px;

    //padding: 25px;
    justify-content: center;
    align-items: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
        align-items: flex-start;
    }
`;

const StyledFullWidthButton = styled(FullWidthButton)`
    background: ${p => p.theme.background.accentGreen};
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
        color: ${p => p.theme.text.accentGreen};
        font-weight: 700;
        
    }
`