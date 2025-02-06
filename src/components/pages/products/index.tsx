// ./src/components/pages/products/index.tsx

import React, { useEffect, useState } from 'react';
import { TH1, TP, ContentContainer, Stack, Price, Link, Divider, TH2 } from '@/src/components/atoms';
import { FullWidthButton } from '@/src/components/molecules/Button';
import { NotifyMeForm } from '@/src/components/molecules/NotifyMeForm';
import { ProductPageProductsSlider } from '@/src/components/organisms/ProductPageProductsSlider';
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
// Removed generateProductSpecs from here
import { ProductTabs } from '@/src/components/molecules/ProductTabs';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { OptionTabContent } from '@/src/components/organisms/OptionTabContent';
import { ProductOptionTabs } from '@/src/components/molecules/ProductOptionTabs';
import { ProductStory } from '@/src/components/organisms/ProductStory';
import { Ratings } from '@/src/components/molecules/Ratings';
import { ProductSpecsTable } from '@/src/components/molecules/ProductSpecsTable'; // Import the new component
import { storefrontApiQuery } from '@/src/graphql/client';
import { useChannels } from '@/src/state/channels';
import { ProductSizingTable } from '@/src/components/molecules/ProductSizingTable';
import { HomePageSliders } from '@/src/components/organisms/HomePageSliders';

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

    // **1. Add a Conditional Check for Both `props.product` and `product`**
    if (!props.product || !product) {
        // You can customize this fallback UI as needed
        return (
            <Layout categories={props.collections ?? []} navigation={props.navigation ?? []} subnavigation={props.subnavigation ?? []}>
                <ContentContainer>
                    <Wrapper column>
                        <Stack w100 column gap={20}>
                            {/*<StyledBoughtHeading>{t('product-not-found')}</StyledBoughtHeading>*/}
                            {/*<StyledBoughtContent>{t('the-product-you-are looking for does not exist or has been removed.')}</StyledBoughtContent>*/}
                        </Stack>
                    </Wrapper> {/* Added missing closing tag here */}
                </ContentContainer>
            </Layout>
        );
    }

    const breadcrumbs = [
        { name: breadcrumb('breadcrumbs.home'), href: '/' },
        { name: props.product.name, href: `/snowboards/${props.product.slug}` },
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
    }, [product.id, ctx]); // Removed optional chaining

    // **2. Use `specs` from Props**
    const specs = props.specs; // Now using specs from props

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
                                <Stack gap={15}>
                                    {typeof product.customFields?.brand === 'string' && (
                                        <StyledBrand noWrap>
                                            {product.customFields.brand}
                                        </StyledBrand>
                                    )}
                                    <StyledProductTitle>{product.name}</StyledProductTitle>
                                </Stack>
                                <Ratings rating={Math.random() * 5} />
                                {variant && <Price size="40px" price={variant.priceWithTax} currencyCode={variant.currencyCode} />}
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
                                    gap="0.25rem"
                                >
                                    <StockDisplay>
                                        <TP>
                                            {!variant
                                                ? null
                                                : Number(variant?.stockLevel) > 0
                                                    ? (
                                                        <span>
                                                            <b>{variant?.stockLevel}</b> {t('stock-levels.left-in-stock')}
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
                                        variant?.customFields?.shortdescription || product.description || ''
                                    );

                                    return shortDescription ? (
                                        <StyledDescription
                                            dangerouslySetInnerHTML={{ __html: shortDescription }} // now always a string
                                            color="main"
                                            // size="1rem"
                                            // lineHeight="1.5rem"
                                            // style={{ marginTop: '1rem' }}
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
                                                .filter(tabIndex => (variant?.customFields as Record<string, any>)[`optionTab${tabIndex}Visible`])
                                                .map(tabIndex => ({
                                                    title: (variant?.customFields as Record<string, any>)[`optionTab${tabIndex}Label`] || `Option Tab ${tabIndex}`,
                                                    children: (
                                                        <OptionTabContent
                                                            customFields={variant?.customFields}
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
                                // Existing Description Tabs
                                ...(variant?.customFields
                                    ? Array.from({ length: 3 }, (_, i) => i + 1)
                                        .filter(tabIndex => (variant?.customFields as Record<string, any>)[`descriptionTab${tabIndex}Visible`])
                                        .map(tabIndex => ({
                                            title: (variant?.customFields as Record<string, any>)[`descriptionTab${tabIndex}Label`] || `Description Tab ${tabIndex}`,
                                            children: (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: (variant?.customFields as Record<string, any>)[`descriptionTab${tabIndex}Content`] || 'No content available',
                                                    }}
                                                />
                                            ),
                                        }))
                                    : []),
                                // {
                                //     title: 'Specifications',
                                //     children: <ProductSpecsTable specs={specs} />,
                                // },
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
                                // Add Specifications Tab
                            ]}
                        />
                    </Stack>

                </Wrapper>
                <Stack w100 column gap={20}>
                    <StyledBoughtHeading>{t('clients-also-bought')}</StyledBoughtHeading>
                    <StyledBoughtContent>
                        Aenean faucibus egestas ipsum, nec consequat urna fermentum sit amet. Ut scelerisque elit in leo hendrerit, pretium ultricies nisi euismod.
                    </StyledBoughtContent>
                </Stack>
            </ContentContainer>
            <HomePageSliders useVariants={true}   sliders={props.clientsAlsoBought} seeAllText={'test'}></HomePageSliders>

            {/*<ProductPageProductsSlider*/}
            {/*    title={t('recently-viewed')}*/}
            {/*    products={props.clientsAlsoBought?.collection?.productVariants?.items ?? []}*/}
            {/*/>*/}
            {/*<ProductPageProductsSlider title={t('recently-viewed')} products={recentlyProducts ?? []} />*/}
            <ProductStory slug={props.product.slug} />
        </Layout>
    );
};

// Fields to display, with their corresponding keys and labels
const fields = [
    { key: 'boardWidth', label: 'Board Width (cm)' },
    { key: 'riderLengthMin', label: 'Rider Length Min (cm)' },
    { key: 'riderLengthMax', label: 'Rider Length Max (cm)' },
    { key: 'riderWeightMin', label: 'Rider Weight Min (kg)' },
    { key: 'riderWeightMax', label: 'Rider Weight Max (kg)' },
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


// Styled Components (unchanged)
const StyledBoughtHeading = styled(TH2)`
    margin-top: 60px;
    font-size: 38px;
    line-height: 38px;
    font-weight: 600;
    
    @media(max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 30px;
        line-height: 30px;
        
    }
`;

const StyledBoughtContent = styled('p')`
    font-size: 20px;
    line-height: 26px;
    color: ${p => p.theme.text.subtitle};

    @media(max-width: 767px) {
        font-size: 18px;
        line-height: 26px;
    }
`;

const StyledDescription = styled(Stack)`
    font-family: 'Calibri', sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
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
    //padding-bottom: 1rem;
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
    //margin: 1.5rem 0;
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
    transition: background 250ms ease-in-out, transform 200ms ease-in-out, box-shadow 250ms ease-in-out;

    svg {
        flex-shrink: 0;
    }

    &:hover {
        color: white;
        background: ${({ theme }) => theme.background.accentGreenHover || theme.background.accentGreen};
        transform: scale(1.03);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: scale(0.98);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
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
