import { useCollection } from '@/src/state/collection';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { ContentContainer, Stack, TP, TH1, MainGrid, TH2 } from '@/src/components/atoms';
import { Breadcrumbs } from '@/src/components/molecules';
import { IconButton } from '@/src/components/molecules/Button';
import { FacetFilterCheckbox } from '@/src/components/molecules/FacetFilter';
import { Pagination } from '@/src/components/molecules/Pagination';
import { ProductTile } from '@/src/components/molecules/ProductTile';
import { SortBy } from '@/src/components/molecules/SortBy';
import { getStaticProps } from './props';
import { Layout } from '@/src/layouts';

const CollectionPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
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
    ].filter(b => b.name !== '__root_collection__');

    return (
        <Layout categories={props.collections} navigation={props.navigation}>
            <HeadingStack>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <TH1>{collection?.name}</TH1>

            </HeadingStack>

            <ContentContainer>
                {/*<AnimatePresence>*/}
                {/*    {filtersOpen && (*/}
                {/*        */}
                {/*    )}*/}
                {/*</AnimatePresence>*/}
                <RelativeStack gap="2rem">
                    <ScrollPoint id="collection-scroll" />
                    <Wrapper flexWrap>
                        <Facets
                            onClick={() => setFiltersOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}>
                            <FacetsFilters
                                onClick={e => e.stopPropagation()}
                                initial={{ translateX: '-100%' }}
                                animate={{ translateX: '0%' }}
                                exit={{ translateX: '-100%' }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                <Stack column flexWrap>
                                    {/*<Stack justifyBetween itemsCenter>*/}
                                    {/*    <TP weight={400} upperCase>*/}
                                    {/*        {t('filters')}*/}
                                    {/*    </TP>*/}
                                    {/*    <IconButton onClick={() => setFiltersOpen(false)}>*/}
                                    {/*        <X />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Stack>*/}
                                    <Stack column flexWrap>
                                        {facetValues?.map(f => (
                                            <FacetFilterCheckbox
                                                facet={f}
                                                key={f.code}
                                                selected={filters[f.id]}
                                                onClick={(group, value) => {
                                                    if (filters[group.id]?.includes(value.id))
                                                        removeFilter(group, value);
                                                    else applyFilter(group, value);
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Stack>
                            </FacetsFilters>
                        </Facets>

                    </Wrapper>
                    <Stack w100 column>
                        <Wrapper column justifyBetween>
                            <Stack itemsEnd>
                                <TH2 size="30px">{collection?.name}</TH2>
                            </Stack>
                            <Stack justifyEnd itemsCenter gap="2.5rem">
                                {/*<Filters onClick={() => setFiltersOpen(true)}>*/}
                                {/*    <TP>{t('filters')}</TP>*/}
                                {/*    <IconButton title={t('filters')}>*/}
                                {/*        <Filter />*/}
                                {/*    </IconButton>*/}
                                {/*</Filters>*/}
                                <SortBy sort={sort} handleSort={handleSort} />{' '}
                            </Stack>
                        </Wrapper>
                        <MainGrid>
                            {products?.map(p => <ProductTile collections={props.collections} product={p} key={p.slug} />)}
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
    height: 421px;
    gap: 60px;
    display: flex;

    position: relative;
    z-index: 1;

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
        //z-index: 0;
        z-index: -1; /* Set the background behind the content */
    }
`;


const Wrapper = styled(Stack)`
    margin-top: 70px;
    flex-direction: column;
    gap: 2rem;
    @media (min-width: ${p => p.theme.breakpoints.xl}) {
        flex-direction: row;
    }
`;

const RelativeStack = styled(Stack)`
    position: relative;
    //padding-top: 2rem;
    @media (min-width: ${p => p.theme.breakpoints.xl}) {
        //padding: 3.5rem 0;
    }
`;

const ScrollPoint = styled.div`
    position: absolute;
    top: -5rem;
    left: 0;
`;

const Filters = styled(Stack)`
    width: auto;
    cursor: pointer;
`;

const Facets = styled(motion.div)`
    width: 100%;
    display: flex;
    flex-direction: column;

        // background: ${p => p.theme.grayAlpha(900, 0.5)};
    //position: fixed;
    //inset: 0;
    //z-index: 2138;
`;
const FacetsFilters = styled(motion.div)`
    display: flex;
    max-width: 287px;
    flex-direction: column;

    width: 100%;
    //background: ${p => p.theme.gray(0)};
    //position: absolute;
    //top: 0;
    //bottom: 0;
    //padding: 2rem;
    //left: 0;
    //z-index: 1;
    //overflow-y: auto;
`;

export default CollectionPage;
