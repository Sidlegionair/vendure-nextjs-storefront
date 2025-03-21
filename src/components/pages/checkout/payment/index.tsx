import React, { useEffect } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { OrderSummary } from '../components/OrderSummary';
import { OrderPayment } from '../components/OrderPayment';
import { CheckoutLayout } from '@/src/layouts';
import { useTranslation } from 'next-i18next';
import { getServerSideProps } from './props';
import styled from '@emotion/styled';
import { ContentContainer, Stack } from '@/src/components/atoms';
import { StepsBar } from '@/src/components/molecules/StepsBar';

export const PaymentPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('checkout');

    useEffect(() => {
        window.onpopstate = () => window.history.forward();
    }, []);

    return (
        <CheckoutLayout pageTitle={`${t('seoTitles.payment')}`}>
            <Content>
                {/* StepsBar at the top */}
                <StepsBar
                    currentStep={2}
                    steps={[
                        t('orderForm.steps.accountInformation'),
                        t('orderForm.steps.billingDetails'),
                        t('orderForm.steps.reviewPayment'),
                    ]}
                />
                <Container>
                    <FormColumn>
                        <OrderPayment availablePaymentMethods={props.eligiblePaymentMethods} />
                    </FormColumn>
                    <SummaryColumn>
                        <OrderSummary />
                    </SummaryColumn>
                </Container>
            </Content>
        </CheckoutLayout>
    );
};

const Content = styled(ContentContainer)`
    position: relative;
    width: 1280px;
    padding: 0;

    @media (max-width: 1560px) {
        width: 1440px;
        padding: 0 4rem;
    }
`;

const Container = styled(Stack)`
    /* Similar to the OrderForm container */
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: row;
        align-items: flex-start;
    }
`;

const FormColumn = styled.div`
    flex: 1; /* Grow to take available space */
    margin-right: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        margin-right: 0;
    }
`;

const SummaryColumn = styled.div`
    width: 600px;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        margin-top: 2rem;
    }
`;
