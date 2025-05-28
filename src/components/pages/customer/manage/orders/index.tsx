import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CustomerNavigation } from '../components/CustomerNavigation';
import { storefrontApiQuery } from '@/src/graphql/client';
import { ActiveCustomerSelector, ActiveOrderSelector } from '@/src/graphql/selectors';
import { Stack } from '@/src/components/atoms/Stack';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { SortOrder } from '@/src/zeus';
import styled from '@emotion/styled';
import { Button } from '@/src/components/molecules/Button';
import { Input } from '@/src/components/forms';
import { useTranslation } from 'next-i18next';
import { OrderBox } from './components/OrderBox';
import { CustomerWrap, FormContainer, FormWrapper } from '../../components/shared';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';

const GET_MORE = 4;

export const HistoryPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const [query, setQuery] = useState('');
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const scrollableRef = useRef<HTMLDivElement>(null);
    const [activeOrders, setActiveOrders] = useState(props.activeCustomer?.orders.items);

    const lookForOrder = async (contains: string) => {
        const { activeCustomer } = await storefrontApiQuery(ctx)({
            activeCustomer: {
                ...ActiveCustomerSelector,
                orders: [
                    {
                        options: {
                            take: page * GET_MORE,
                            skip: page * GET_MORE - GET_MORE,
                            filter: { code: { contains } },
                        },
                    },
                    { items: ActiveOrderSelector },
                ],
            },
        });
        if (!activeCustomer) {
            setActiveOrders([]);
            setLoading(false);
            return;
        }
        setActiveOrders(activeCustomer.orders.items);
        setLoading(false);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        if (query === '') {
            setActiveOrders(props.activeCustomer?.orders.items);
            setLoading(false);
            return;
        }
        setLoading(true);
        const timer = setTimeout(() => {
            lookForOrder(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const onLoadMore = async () => {
        setMore(true);
        const { activeCustomer } = await storefrontApiQuery(ctx)({
            activeCustomer: {
                ...ActiveCustomerSelector,
                orders: [
                    { options: { take: GET_MORE, skip: activeOrders?.length, sort: { createdAt: SortOrder.DESC } } },
                    { items: ActiveOrderSelector, totalItems: true },
                ],
            },
        });

        if (!activeCustomer) {
            setMore(false);
            return;
        }

        setActiveOrders([...(activeOrders || []), ...activeCustomer.orders.items]);
        setPage(page + 1);
        await new Promise(resolve => setTimeout(resolve, 200));
        setMore(false);
        scrollableRef.current?.scrollTo({ top: scrollableRef.current?.scrollHeight, behavior: 'smooth' });
    };

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('ordersPage.title')}>
            <StyledContentContainer>
                <Stack w100 justifyCenter>
                    <CustomerNavigation />
                </Stack>
                <FormContainer>
                    <FormWrapper>
                        <CustomerWrap w100 itemsStart gap="1.75rem">
                            <Stack column w100 gap="1rem">
                        <TP size="2.5rem" weight={600}>
                            {t('ordersPage.title')}
                        </TP>
                        <Main column w100 gap="1.5rem">
                            <Input
                                label={t('ordersPage.searchOrder')}
                                placeholder={t('ordersPage.lookForOrder')}
                                onChange={onSearch}
                            />
                            <Wrap flexWrap w100 ref={scrollableRef}>
                                {!loading ? (
                                    activeOrders?.map(order => <OrderBox key={order.id} order={order} />)
                                ) : (
                                    <TP>{t('ordersPage.loading')}</TP>
                                )}
                            </Wrap>
                            {props.activeCustomer?.orders.totalItems > activeOrders?.length && (
                                <ButtonWrap w100>
                                    <StyledButton loading={more} onClick={onLoadMore}>
                                        {t('ordersPage.loadMore')}
                                    </StyledButton>
                                </ButtonWrap>
                            )}
                        </Main>
                    </Stack>
                </CustomerWrap>
                    </FormWrapper>
                </FormContainer>

            </StyledContentContainer>
        </Layout>
    );
};

const Main = styled(Stack)`

    @media(min-width: 767px) {
        min-width: 600px;
    }
`;

const ButtonWrap = styled(Stack)`
    padding: 1rem;
`;

const StyledButton = styled(Button)`
    width: 100%;
`;

const Wrap = styled(Stack)`
    position: relative;

    max-height: 60vh;
    overflow-y: auto;

    ::-webkit-scrollbar {
        height: 0.8rem;
        width: 0.8rem;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.shadow};
        border-radius: 1rem;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${p => p.theme.gray(400)};
    }
`;

const StyledContentContainer = styled(ContentContainer)`
    padding: 80px 50px 50px;
    justify-content: start;
    align-items: center;
    z-index: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints['3xl']}) {
        width: 100%;
        padding: 4rem 4rem 2rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints['2xl']}) {
        width: 100%;
        padding: 4rem 3rem 2rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        width: 100%;
        padding: 4rem 2rem 2rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        padding: 4rem 1.5rem 2rem;
    }




    position: relative;
    height: 100%;
    min-height: 100vh;
    width: 100%;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('/images/bg/authbg.jpeg') no-repeat center center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1; /* Set the background behind the content */
    }
`;
