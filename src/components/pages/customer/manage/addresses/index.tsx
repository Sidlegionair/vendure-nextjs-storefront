import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React, { useRef } from 'react';
import { CustomerNavigation } from '../components/CustomerNavigation';
import { AddressBox } from './components/AddressBox';
import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { AnimatePresence, motion } from 'framer-motion';
import { AddressForm } from './components/AddressForm';
import { useAddresses } from './hooks';
import { useTranslation } from 'next-i18next';
import { CustomerWrap, FormContainer, FormWrapper } from '../../components/shared';
import { baseCountryFromLanguage } from '@/src/util/baseCountryFromLanguage';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';
import { useOutsideClick } from '@/src/util/hooks/useOutsideClick';

export const AddressesPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('customer');
    const ctx = useChannels();
    const { activeCustomer, addressToEdit, deleting, onDelete, onEdit, onModalClose, onSubmitCreate, onSubmitEdit } =
        useAddresses(props.activeCustomer, ctx);

    const country =
        activeCustomer.addresses?.find(a => a.defaultBillingAddress || a.defaultShippingAddress)?.country?.code ??
        baseCountryFromLanguage(ctx.locale);

    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, () => onModalClose());

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('addressesPageTitle')}>
            <AnimatePresence>
                {addressToEdit && (
                    <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ModalContent ref={ref} itemsCenter column>
                            <AddressForm
                                onSubmit={onSubmitEdit}
                                availableCountries={props.availableCountries}
                                addressToEdit={addressToEdit}
                                onModalClose={onModalClose}
                                country={country}
                            />
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
            <StyledContentContainer>
                <Stack w100 justifyCenter>
                    <CustomerNavigation />
                </Stack>
                <FormContainer>
                    <FormWrapper>
                    <CustomerWrap w100 itemsStart gap="1.75rem">
                    <Wrapper w100 gap="1.5rem">
                        <Stack w100>
                            <AddressForm
                                country={country}
                                onSubmit={onSubmitCreate}
                                availableCountries={props.availableCountries}
                            />
                        </Stack>
                        <Wrap w100 itemsEnd gap="2.5rem">
                            {activeCustomer?.addresses?.map(address => (
                                <AddressBox
                                    key={address.id}
                                    address={address}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    deleting={deleting}
                                />
                            ))}
                        </Wrap>
                    </Wrapper>
                </CustomerWrap>
                    </FormWrapper>
                </FormContainer>
            </StyledContentContainer>
        </Layout>
    );
};

const Wrapper = styled(Stack)`
    justify-content: space-between;
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column-reverse;
        gap: 3rem;
    }
`;

const Wrap = styled(Stack)`
    overflow: visible;
    padding: 1.75rem 0;
    width: 100%;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
    }
`;

const ModalContent = styled(Stack)`
    width: 100%;
    max-width: 800px;
    padding: 3.5rem;
    background-color: ${p => p.theme.background.main};
    border-radius: ${p => p.theme.borderRadius};
    overflow-y: auto;
    max-height: 90vh;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        padding: 2.5rem;
        max-width: 90%;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 1.5rem;
        max-width: 95%;
    }
`;

const Modal = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2139;
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: ${p => p.theme.background.modal};
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
