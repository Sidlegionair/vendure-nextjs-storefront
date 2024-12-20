import React, { useEffect, useState } from 'react';
import { TH1, TP, ContentContainer, Stack, Price, Link, Divider, TH2 } from '@/src/components/atoms';
import { FullWidthButton } from '@/src/components/molecules/Button';
import { NotifyMeForm } from '@/src/components/molecules/NotifyMeForm';
import { ProductPageProductsSlider } from '@/src/components/organisms/ProductPageProductsSlider';
import { Layout } from '@/src/layouts';
import styled from '@emotion/styled';
import { ArrowRightIcon, Heading, ShoppingBasket } from 'lucide-react';
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
                    <MobileHideWrapper>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </MobileHideWrapper>
                    <Main gap="2rem">
                        <StickyLeft w100 itemsCenter justifyCenter gap="2rem">
                            <ProductPhotosPreview
                                featuredAsset={product?.featuredAsset}
                                images={product?.assets}
                                name={product?.name}
                            />
                        </StickyLeft>
                        <ResponsiveRightColumn w100 column>
                            <ProductInfoStack w100 column gap={25}>
                                <Stack gap={15}>
                                    {typeof product?.customFields?.brand === 'string' && (
                                        <StyledBrand noWrap>
                                            {product.customFields.brand}
                                        </StyledBrand>
                                    )}
                                    <StyledProductTitle>{product?.name}</StyledProductTitle>
                                </Stack>
                                <Ratings rating={Math.random() * 5} />
                                {variant && <Price size="40px" price={variant.priceWithTax} currencyCode={variant.currencyCode} />}
                            </ProductInfoStack>
                            <Stack w100 gap="1rem" column>
                                {variant && Number(variant.stockLevel) > 0 && Number(variant.stockLevel) <= 10 && (
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
                                {(() => {
                                    // Attempt to get variant-level short description
                                    console.log(variant);
// Safely convert to string
                                    const shortDescription = String(
                                        variant?.customFields?.shortdescription || product?.description || ''
                                    );

                                    return shortDescription ? (
                                        <StyledDescription
                                            dangerouslySetInnerHTML={{ __html: shortDescription }} // now always a string
                                            color="main"
                                            size="1rem"
                                            lineHeight="1.5rem"
                                            style={{ marginTop: '1rem' }}
                                        />
                                    ) : null;
                                })()}

                            </Stack>

                            <Stack w100 column>
                                <ProductOptionTabs
                                    defaultOpenIndex={0}
                                    data={[
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
                                        ...(variant?.customFields
                                            ? Array.from({ length: 4 }, (_, i) => i + 1)
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
                            <StyledDividerTop />
                            <Stack justifyBetween>
                                <TP weight={700} size={18}>FREE SHIPPING</TP>
                            </Stack>
                            <StyledDividerTop />
                            {!variant ? null : Number(variant.stockLevel) <= 0 ? (
                                <NotifyMeForm />
                            ) : (
                                <ResponsiveActionRow gap={20}>
                                    <QuantityCounter
                                        size="14px"
                                        height="56px"
                                        v={quantity}
                                        onChange={v => handleSetItemQuantityInCart(v)}
                                    />
                                    <StyledFullWidthButton
                                        onClick={handleAddToCart}
                                    >
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
                    <StyledBoughtContent>Aenean faucibus egestas ipsum, nec consequat urna fermentum sit amet. Ut scelerisque elit in leo hendrerit, pretium ultricies nisi euismod.</StyledBoughtContent>
                </Stack>
            </ContentContainer>
            <ProductPageProductsSlider
                title={t('recently-viewed')}
                products={props.clientsAlsoBought?.collection?.productVariants?.items ?? []}
            />
            <ProductPageProductsSlider title={t('recently-viewed')} products={recentlyProducts ?? []} />
            <ProductStory slug={props.product.slug} />
        </Layout>
    );
};

// Styled Components

const StyledBoughtHeading = styled(TH2)`
    margin-top: 60px;
    font-size: 38px;
    line-height: 38px;
    font-weight: 600;
    
    @media(max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 30px;
        line-height: 30px;
        
    }
`

const StyledBoughtContent = styled('p')`
    font-size: 20px;
    line-height: 26px;
    color: ${p => p.theme.text.subtitle};

    @media(max-width: 767px) {
        font-size: 18px;
        line-height: 26px;
    }
`

const StyledDescription = styled(TP)`
    font-family: 'Calibri', sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
`

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


const StyledBrand = styled(TH1)`
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;

    @media (min-width: 768px) {
        font-size: 35px; // fallback for larger screens
        line-height: normal;
    }
`;

const StyledProductTitle = styled(TH1)`
    font-weight: 300;
    font-size: 24px;
    line-height: 24px;

    @media (min-width: 768px) {
        font-size: 35px; // fallback for larger screens
        line-height: normal;
    }
`;


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
    padding-bottom: 1rem;
`;

const MakeItQuick = styled(TP)`
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
    margin: 1.5rem 0;
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

    svg {
        flex-shrink: 0;
    }
`;

const StockDisplay = styled(Stack)`
    font-size: 1.125rem; // 18px
    font-weight: 400;
    gap: 3px;
    //margin-top: 20px;

    b {
        color: ${({ theme }) => theme.text.accentGreen};
        font-weight: 700;
    }
`;
