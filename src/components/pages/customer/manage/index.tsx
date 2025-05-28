import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React from 'react';
import { CustomerNavigation } from './components/CustomerNavigation';
import { CustomerForm } from './components/CustomerForm';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { useTranslation } from 'next-i18next';
import { CustomerWrap, FormContainer, FormWrapper } from '../components/shared';
import { getServerSideProps } from './props';
import { Stack } from '@/src/components/atoms';
import styled from '@emotion/styled';

export const ManageAccountPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('customer');
    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('accountPage.title')}>
            <StyledContentContainer>
                <Stack w100 justifyCenter>
                    <CustomerNavigation />
                </Stack>
                <FormContainer>
                    <FormWrapper>
                        <CustomerWrap itemsCenter gap="3rem">
                            <CustomerForm initialCustomer={props.activeCustomer} channels={props.channels} />
                        </CustomerWrap>
                    </FormWrapper>
                </FormContainer>
            </StyledContentContainer>
        </Layout>
    );
};


const StyledContentContainer = styled(ContentContainer)`
    padding: 80px 50px 50px;
    justify-content: start;
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
