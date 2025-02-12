import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCollection } from '@/src/state/collection';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Filter } from 'lucide-react';
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
import { FacetGroupDropdown, FacetGroup, FacetValue } from '@/src/components/molecules/FacetGroupDropdown';

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

    // Parse query params and auto‑apply filters.
    useEffect(() => {
        if (!router.isReady || !facetValues) return;

        Object.entries(router.query).forEach(([key, value]) => {
            if (['page', 'slug', 'channel', 'sort', 'q'].includes(key)) return;

            const queryValue = Array.isArray(value) ? value[0] : value;

            const facetGroup = facetValues.find(
                (f) =>
                    f.id === key ||
                    (f.code && f.code.toLowerCase() === key.toLowerCase()) ||
                    (f.name && f.name.toLowerCase() === key.toLowerCase())
            );

            if (!facetGroup || !facetGroup.values) return;

            const facetValue = facetGroup.values.find(
                (v) => v.id === queryValue || v.name.toLowerCase() === queryValue?.toLowerCase()
            );
            if (!facetValue) return;

            if (!filters[facetGroup.id] || !filters[facetGroup.id].includes(facetValue.id)) {
                applyFilter(facetGroup, facetValue);
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

    // Define which facet groups (by their code) should be shown in the top bar.
    const displayFacetCodes = [
        'rider-level',
        'terrain',
        'rider-length-maxcm',
        'riderweight-maxkg',
        'boot-length-maxcm',
    ];

    // Toggle filter logic.
    const toggleFilter = (group: FacetGroup, value: FacetValue) => {
        const isSelected = filters[group.id]?.includes(value.id);
        const updatedQuery = { ...router.query };

        if (isSelected) {
            delete updatedQuery[group.id];
            router
                .replace({ query: updatedQuery }, undefined, { shallow: true })
                .then(() => {
                    removeFilter(group, value);
                });
        } else {
            updatedQuery[group.id] = value.id;
            router
                .replace({ query: updatedQuery }, undefined, { shallow: true })
                .then(() => {
                    applyFilter(group, value);
                });
        }
    };

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
                <RelativeStack column gap="60px">
                    <ScrollPoint id="collection-scroll" />
                    <Stack>
                        {/* --- TOP BAR WITH FACET DROPDOWNS & SORTBY --- */}
                        <TopFilters>
                            {/* Mobile filter button – visible only on mobile (left cell) */}
                            <MobileFiltersButton onClick={() => setFiltersOpen(true)}>
                                <IconButton >
                                    <Filter />
                                </IconButton>

                                Filters
                            </MobileFiltersButton>

                            {/* Empty cell placeholder on mobile; on desktop, this cell will show desktop filters */}
                            <EmptyCell>
                                <DesktopFilters>
                                    <FacetDropdownsWrapper>
                                        {displayFacetCodes.map((code) => {
                                            const facetGroup = facetValues?.find(
                                                (f) => f.code?.toLowerCase() === code.toLowerCase()
                                            );
                                            if (!facetGroup) return null;
                                            return (
                                                <FacetGroupDropdown
                                                    key={facetGroup.id}
                                                    facetGroup={facetGroup}
                                                    selected={filters[facetGroup.id] || []}
                                                    onToggleFilter={toggleFilter}
                                                />
                                            );
                                        })}
                                    </FacetDropdownsWrapper>
                                </DesktopFilters>
                            </EmptyCell>

                            {/* SortBy control – always on the right */}
                            <SortByWrapper>
                                <SortBy sort={sort} handleSort={handleSort} />
                            </SortByWrapper>
                        </TopFilters>
                    </Stack>

                    <Stack>
                        {/* --- SIDEBAR: Only display facet groups NOT in top bar --- */}
                        <DesktopFacets>
                            <Stack column flexWrap>
                                {facetValues
                                    ?.filter((f) => !displayFacetCodes.includes(f.code?.toLowerCase() || ''))
                                    .map((f) => (
                                        <FacetFilterCheckbox
                                            key={f.id}
                                            facet={f}
                                            selected={filters[f.id]}
                                            onClick={(group, value) => {
                                                const isSelected = filters[group.id]?.includes(value.id);
                                                const updatedQuery = { ...router.query };

                                                if (isSelected) {
                                                    delete updatedQuery[group.id];
                                                    router
                                                        .replace({ query: updatedQuery }, undefined, { shallow: true })
                                                        .then(() => {
                                                            removeFilter(group, value);
                                                        });
                                                } else {
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

                        {/* --- MOBILE OVERLAY --- */}
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

                                        {/* --- Top filters for mobile overlay --- */}
                                        <Stack column gap="1rem">
                                            {facetValues
                                                ?.filter((f) => displayFacetCodes.includes(f.code?.toLowerCase() || ''))
                                                .map((f) => (
                                                    <FacetGroupDropdown
                                                        key={f.id}
                                                        facetGroup={f}
                                                        selected={filters[f.id] || []}
                                                        onToggleFilter={toggleFilter}
                                                    />
                                                ))}
                                        </Stack>

                                        {/* --- Remaining filters --- */}
                                        <Stack column flexWrap>
                                            {facetValues
                                                ?.filter((f) => !displayFacetCodes.includes(f.code?.toLowerCase() || ''))
                                                .map((f) => (
                                                    <FacetFilterCheckbox
                                                        key={f.id}
                                                        facet={f}
                                                        selected={filters[f.id]}
                                                        onClick={(group, value) => {
                                                            const isSelected = filters[group.id]?.includes(value.id);
                                                            const updatedQuery = { ...router.query };

                                                            if (isSelected) {
                                                                delete updatedQuery[group.id];
                                                                router
                                                                    .replace({ query: updatedQuery }, undefined, {
                                                                        shallow: true,
                                                                    })
                                                                    .then(() => {
                                                                        removeFilter(group, value);
                                                                    });
                                                            } else {
                                                                updatedQuery[group.id] = value.id;
                                                                router
                                                                    .replace({ query: updatedQuery }, undefined, {
                                                                        shallow: true,
                                                                    })
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

                        <Stack w100 column>
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
    position: relative;
    z-index: 1;

    @media (max-width: 767px) {
        min-height: 200px;
        gap: 36px;
        padding: 70px 0px;
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

const RelativeStack = styled(Stack)`
    position: relative;
`;

const ScrollPoint = styled.div`
    position: absolute;
    top: -5rem;
    left: 0;
`;

/* TOP BAR – grid with three columns:
   On mobile: left cell for filter icon, center empty, right cell for SortBy.
   On desktop: left empty, center for facet dropdowns, right for SortBy.
*/
const TopFilters = styled.div`
    width: 100%;
    display: grid;
    align-items: center;
    margin: 2rem 0;

    /* Mobile: Three columns – filter icon (col 1), empty (col 2), sort (col 3) */
    @media (max-width: 767px) {
        grid-template-columns: auto auto auto;
    }

    /* Desktop: empty (col 1), facet dropdowns (col 2), sort (col 3) */
    @media (min-width: 768px) {
        grid-template-columns: 1fr auto 1fr;
    }
`;

const EmptyCell = styled.div`
    /* On mobile, place the empty cell in the center */
    @media (max-width: 767px) {
        grid-column: 2;
    }
`;

const MobileFiltersButton = styled.div`
    display: none;
    border: 1px solid #4d4d4d;
    border-radius: 8px;
    padding: 1.8rem 2.4rem;

    /* Only show on mobile, and place it in the left cell */
    @media (max-width: 767px) {
        display: flex;
        //justify-content: center;
        gap: 10px;
        align-items: center;
        grid-column: 1;
        width: fit-content;
    }
`;

const DesktopFilters = styled.div`
    @media (max-width: 767px) {
        display: none;
    }
`;

const FacetDropdownsWrapper = styled.div`
    grid-column: 2;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
`;

const SortByWrapper = styled.div`
    /* Ensure the sort control is always on the right */
    grid-column: 3;
    justify-self: end;
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
    background: ${({ theme }) => theme.background.main};
    width: 80%;
    max-width: 287px;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

export default CollectionPage;
