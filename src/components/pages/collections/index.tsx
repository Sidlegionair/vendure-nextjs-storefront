import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCollection } from '@/src/state/collection';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { ContentContainer, Stack, TP, TH1, MainGrid } from '@/src/components/atoms';
import { Breadcrumbs } from '@/src/components/molecules';
import { IconButton } from '@/src/components/molecules/Button';
import { FacetFilterCheckbox } from '@/src/components/molecules/FacetFilter';
import { Pagination } from '@/src/components/molecules/Pagination';
import { ProductTile } from '@/src/components/molecules/ProductTile';
import { SortBy } from '@/src/components/molecules/SortBy';
import { getStaticProps } from './props';
import { Layout } from '@/src/layouts';

const CollectionPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
    const router = useRouter();
    const { t } = useTranslation('collections');
    const { t: breadcrumb } = useTranslation('common');
    const {
        collection,
        products,
        facetValues,
        filtersOpen,
        setFiltersOpen,
        paginationInfo,
        changePage,
        filters,
        applyFilter,
        removeFilter,
        sort,
        handleSort,
    } = useCollection();

    // Client-side parsing:
    // When the router and facetValues are available, loop over query params (except "page")
    // and, if a matching facet filter isn’t already applied, call applyFilter to update the state.
    useEffect(() => {
        if (!router.isReady || !facetValues) return;

        console.log('[DEBUG] router.query:', router.query);
        console.log('[DEBUG] current filters:', filters);
        console.log('[DEBUG] facetValues:', facetValues);

        Object.entries(router.query).forEach(([key, value]) => {
            // Skip keys that are not intended for filtering
            if (['page', 'slug', 'channel', 'sort', 'q'].includes(key)) return;

            const queryValue = Array.isArray(value) ? value[0] : value;
            console.log(`[DEBUG] Processing query param: ${key} = ${queryValue}`);

            // Try matching by id, code, or name (all lowercased)
            const facetGroup = facetValues.find(
                (f) =>
                    f.id === key ||
                    (f.code && f.code.toLowerCase() === key.toLowerCase()) ||
                    (f.name && f.name.toLowerCase() === key.toLowerCase())
            );

            if (!facetGroup) {
                console.log(`[DEBUG] No facet group found for key "${key}"`);
                return;
            }

            console.log(`[DEBUG] Found facet group: ${facetGroup.name} (id: ${facetGroup.id})`);

            if (!facetGroup.values) {
                console.log(`[DEBUG] Facet group ${facetGroup.id} has no values`);
                return;
            }

            // Look for a facet value that matches the query (by id or (case‑insensitive) name)
            const facetValue = facetGroup.values.find(
                (v) =>
                    v.id === queryValue ||
                    v.name.toLowerCase() === queryValue?.toLowerCase()
            );

            if (!facetValue) {
                console.log(`[DEBUG] No matching facet value found in group ${facetGroup.id} for value "${queryValue}"`);
                return;
            }

            console.log(`[DEBUG] Found facet value: ${facetValue.name} (id: ${facetValue.id})`);

            if (!filters[facetGroup.id] || !filters[facetGroup.id].includes(facetValue.id)) {
                console.log(`[DEBUG] Applying filter for group ${facetGroup.id}: ${facetValue.name}`);
                applyFilter(facetGroup, facetValue);
            } else {
                console.log(`[DEBUG] Filter already applied for group ${facetGroup.id}: ${facetValue.name}`);
            }
        });
    }, [router.isReady, router.query, facetValues, filters, applyFilter]);


    const breadcrumbs = [
        {
            name: breadcrumb('breadcrumbs.home'),
            href: '/',
        },
        {
            name: props.collection?.parent?.name,
            href: `/collections/${props.collection?.parent?.slug}`,
        },
        {
            name: props.collection?.name,
            href: `/collections/${props.collection?.parent?.slug}/${props.collection?.slug}`,
        },
    ].filter((b) => b.name !== '__root_collection__');

    return (
        <Layout
            categories={props.collections}
            navigation={props.navigation}
            subnavigation={props.subnavigation}
        >
            <HeadingStack>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <StyledTH1>{collection?.name}</StyledTH1>
            </HeadingStack>

            <ContentContainer>
                <RelativeStack gap="60px">
                    <ScrollPoint id="collection-scroll" />
                    <Wrapper flexWrap>
                        {/* Desktop Filters: Always Visible */}
                        <DesktopFacets>
                            <Stack column flexWrap>
                                {facetValues?.map((f) => (
                                    <FacetFilterCheckbox
                                        key={f.id}
                                        facet={f}
                                        selected={filters[f.id]}
                                        onClick={(group, value) => {
                                            const isSelected = filters[group.id]?.includes(value.id);
                                            // Clone the current query so we can update it
                                            const updatedQuery = { ...router.query };

                                            if (isSelected) {
                                                // Remove the filter param from the query first
                                                delete updatedQuery[group.id];

                                                // Update the URL, then remove the filter from state
                                                router
                                                    .replace({ query: updatedQuery }, undefined, { shallow: true })
                                                    .then(() => {
                                                        removeFilter(group, value);
                                                    });
                                            } else {
                                                // Add the filter to the query first
                                                updatedQuery[group.id] = value.id;

                                                router
                                                    .replace({ query: updatedQuery }, undefined, { shallow: true })
                                                    .then(() => {
                                                        applyFilter(group, value);
                                                    });
                                            }
                                        }}
                                    />


                                ))}
                            </Stack>
                        </DesktopFacets>

                        {/* Mobile Overlay Filters */}
                        <AnimatePresence>
                            {filtersOpen && (
                                <FacetsOverlay
                                    onClick={() => setFiltersOpen(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                >
                                    <FacetsFilters
                                        onClick={(e) => e.stopPropagation()}
                                        initial={{ x: '-100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '-100%' }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <Stack justifyBetween itemsCenter>
                                            <TP weight={400} upperCase>
                                                {t('filters')}
                                            </TP>
                                            <IconButton onClick={() => setFiltersOpen(false)}>
                                                <X />
                                            </IconButton>
                                        </Stack>
                                        <Stack column flexWrap>
                                            {facetValues?.map((f) => (
                                                <FacetFilterCheckbox
                                                    key={f.id}
                                                    facet={f}
                                                    selected={filters[f.id]}
                                                    onClick={(group, value) => {
                                                        const isSelected = filters[group.id]?.includes(value.id);
                                                        // Clone the current query so we can update it
                                                        const updatedQuery = { ...router.query };

                                                        if (isSelected) {
                                                            // Remove the filter param from the query first
                                                            delete updatedQuery[group.id];

                                                            // Update the URL, then remove the filter from state
                                                            router
                                                                .replace({ query: updatedQuery }, undefined, { shallow: true })
                                                                .then(() => {
                                                                    removeFilter(group, value);
                                                                });
                                                        } else {
                                                            // Add the filter to the query first
                                                            updatedQuery[group.id] = value.id;

                                                            router
                                                                .replace({ query: updatedQuery }, undefined, { shallow: true })
                                                                .then(() => {
                                                                    applyFilter(group, value);
                                                                });
                                                        }
                                                    }}
                                                />


                                            ))}
                                        </Stack>
                                    </FacetsFilters>
                                </FacetsOverlay>
                            )}
                        </AnimatePresence>
                    </Wrapper>
                    <Stack w100 column>
                        <Wrapper column justifyBetween>
                            <StyledSortStack itemsCenter gap="2.5rem">
                                {/* Show mobile filters button only on mobile */}
                                <MobileFilters onClick={() => setFiltersOpen(true)}>
                                    <TP>{t('filters')}</TP>
                                    <IconButton title={t('filters')}>
                                        <svg
                                            width="25"
                                            height="24"
                                            viewBox="0 0 25 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M24 11.9994H8.63973M3.21795 11.9994H1M3.21795 11.9994C3.21795 11.2756 3.50349 10.5815 4.01177 10.0698C4.52004 9.558 5.20941 9.2705 5.92822 9.2705C6.64702 9.2705 7.33639 9.558 7.84467 10.0698C8.35294 10.5815 8.63849 11.2756 8.63849 11.9994C8.63849 12.7231 8.35294 13.4172 7.84467 13.929C7.33639 14.4407 6.64702 14.7282 5.92822 14.7282C5.20941 14.7282 4.52004 14.4407 4.01177 13.929C3.50349 13.4172 3.21795 12.7231 3.21795 11.9994ZM24 20.2699H16.8538M16.8538 20.2699C16.8538 20.9938 16.5676 21.6887 16.0592 22.2005C15.5508 22.7124 14.8613 23 14.1423 23C13.4235 23 12.7341 22.7112 12.2259 22.1995C11.7176 21.6877 11.4321 20.9936 11.4321 20.2699M16.8538 20.2699C16.8538 19.546 16.5676 18.8523 16.0592 18.3404C15.5508 17.8286 14.8613 17.541 14.1423 17.541C13.4235 17.541 12.7341 17.8285 12.2259 18.3403C11.7176 18.852 11.4321 19.5461 11.4321 20.2699M11.4321 20.2699H1M24 3.72888H20.1397M14.7179 3.72888H1M14.7179 3.72888C14.7179 3.00513 15.0035 2.31103 15.5118 1.79927C16.02 1.28751 16.7094 1 17.4282 1C17.7841 1 18.1366 1.07058 18.4654 1.20772C18.7942 1.34486 19.093 1.54587 19.3447 1.79927C19.5963 2.05267 19.796 2.3535 19.9322 2.68458C20.0684 3.01566 20.1385 3.37052 20.1385 3.72888C20.1385 4.08724 20.0684 4.44209 19.9322 4.77317C19.796 5.10425 19.5963 5.40508 19.3447 5.65848C19.093 5.91188 18.7942 6.11289 18.4654 6.25003C18.1366 6.38717 17.7841 6.45775 17.4282 6.45775C16.7094 6.45775 16.02 6.17025 15.5118 5.65848C15.0035 5.14672 14.7179 4.45262 14.7179 3.72888Z"
                                                stroke="black"
                                                strokeWidth="1.5"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </IconButton>
                                </MobileFilters>

                                <SortBy sort={sort} handleSort={handleSort} />
                            </StyledSortStack>
                        </Wrapper>
                        <MainGrid>
                            {products?.map((p) => (
                                <ProductTile product={p} key={p.slug} />
                            ))}
                        </MainGrid>
                        <Pagination
                            page={paginationInfo.currentPage}
                            changePage={changePage}
                            totalPages={paginationInfo.totalPages}
                        />
                    </Stack>
                </RelativeStack>
            </ContentContainer>
        </Layout>
    );
};

const HeadingStack = styled(Stack)`
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0px;
    gap: 60px;
    display: flex;
    position: relative;
    z-index: 1;

    @media (max-width: 767px) {
        min-height: 200px;
        gap: 36px;
        padding: 70px 0px;
        height: unset;
    }

    ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('/images/bg/collectionheaderbg.jpeg') no-repeat center center;
        background-size: cover;
        opacity: 0.3;
        z-index: -1;
    }
`;

const StyledTH1 = styled(TH1)`
    font-size: 55px;
    line-height: 55px;

    @media (max-width: 767px) {
        font-size: 40px;
        line-height: 40px;
    }
`;

const Wrapper = styled(Stack)`
    margin-top: 70px;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: ${(p) => p.theme.breakpoints.xl}) {
        flex-direction: row;
    }
`;

const StyledSortStack = styled(Stack)`
    justify-content: flex-end;
    align-items: end;
    width: 100%;

    @media (max-width: 767px) {
        justify-content: space-between;
    }
`;

const RelativeStack = styled(Stack)`
    position: relative;
`;

const ScrollPoint = styled.div`
    position: absolute;
    top: -5rem;
    left: 0;
`;

const DesktopFacets = styled.div`
    display: none;

    @media (min-width: ${(p) => p.theme.breakpoints.xl}) {
        display: block;
        max-width: 287px;
        width: 100%;
        padding-right: 2rem;
    }
`;

const MobileFilters = styled(Stack)`
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.006);
    border: 1px solid #4d4d4d;
    border-radius: 8px;
    width: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 15px;

    p {
        font-size: 14px;
        line-height: 14px;
        font-weight: 300;
    }

    @media (min-width: ${(p) => p.theme.breakpoints.xl}) {
        display: none;
    }
`;

const FacetsOverlay = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 2138;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-start;
    align-items: stretch;

    @media (min-width: ${(p) => p.theme.breakpoints.xl}) {
        display: none;
    }
`;

const FacetsFilters = styled(motion.div)`
    background: ${(p) => p.theme.background.main};
    width: 80%;
    max-width: 287px;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

export default CollectionPage;
