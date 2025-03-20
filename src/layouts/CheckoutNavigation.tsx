import { LogoAexol } from '@/src/assets';
import { ContentContainer, Divider } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

export const CheckoutNavigation: React.FC = () => {
    const { t } = useTranslation('common');

    return (
        <StickyContainer>
            <CustomContentContainer>
                <CenterStack>
                    <LogoAexol width={256} />
                </CenterStack>
                <Divider />
            </CustomContentContainer>
        </StickyContainer>
    );
};

// Styled Components

const StickyContainer = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 15px 0 56px 0;
    position: fixed;
    top: 0;
    background: #FFFFFF;
    z-index: 2137;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.06);

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        padding: 25px;
        position: sticky;
    }
`;

const CustomContentContainer = styled(ContentContainer)`
    gap: 2rem;
    padding-bottom: 65px;
`;

const CenterStack = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
