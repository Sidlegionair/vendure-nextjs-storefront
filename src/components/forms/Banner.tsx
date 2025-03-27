import { forwardRef } from 'react';
import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';
import { GlobalError } from 'react-hook-form';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

type BannerType = HTMLMotionProps<'div'> & {
    success?: { message?: string; type?: string | number };
    error?: GlobalError & { type?: string | number; message?: string };
    clearErrors?: () => void;
};

export const Banner = forwardRef((props: BannerType, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { error, success, clearErrors, ...rest } = props;

    const type = error ? 'error' : 'success';
    const prop = error ? error : success;

    return (
        <BannerWrapper>
            <Position ref={ref} />
            <AnimatePresence>
                {prop?.message && (
                    <BannerBox
                        status={type}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                        }}
                        {...rest}>
                        {clearErrors && (
                            <HideBannerButton onClick={clearErrors}>
                                <X color="white" size={'1.5rem'} />
                            </HideBannerButton>
                        )}
                        <BannerContent w100 column>
                            {prop?.type && <FormError>{prop?.type}</FormError>}
                            <FormError status={type}>
                                {/*<IconWrapper justifyCenter itemsCenter type={type}>*/}
                                {/*    <AlertCircle size={'1.5rem'} />*/}
                                {/*</IconWrapper>*/}
                                {prop?.message}
                            </FormError>
                        </BannerContent>
                    </BannerBox>
                )}
            </AnimatePresence>
        </BannerWrapper>
    );
});

Banner.displayName = 'Banner';

const IconWrapper = styled(Stack)<{ type: 'success' | 'error' }>`
    margin-top: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    color: ${p => (p.type === 'success' ? p.theme.success : p.theme.error)};
`;

const BannerWrapper = styled(Stack)`
    width: 100%;
    position: relative;
`;

const HideBannerButton = styled.div`
    position: absolute;
    top: 0.2rem;
    right: 0.4rem;
    cursor: pointer;
`;

const Position = styled.span`
    position: absolute;
    top: -1.5rem;
    left: 0;
    opacity: 0;
    pointer-events: none;
`;

const BannerBox = styled(motion.div)<{ status?: 'success' | 'error' }>`
    padding: 0.75rem 1.5rem;
    width: 100%;
    border-radius: 7px;
    border: 1px solid ${p => (p.status === 'success' ? p.theme.background.accentGreen : p.theme.background.accent)};
    background-color: ${p => (p.status === 'success' ? p.theme.background.accentGreen : p.theme.background.accent)};
    font-size: ${p => p.theme.typography.fontSize.h6};
    box-shadow: 0.3rem 0.2rem 0.3rem 0.1rem ${({ theme }) => theme.shadow};
`;

const BannerContent = styled(Stack)`
    color: ${p => p.theme.background.main};

`;

const FormError = styled(motion.span)<{ status?: 'success' | 'error' }>`
    color: ${p => p.theme.background.main}
    font-size: ${p => p.theme.typography.fontSize.h6};
    display: flex;
    gap: 1rem;
    align-items: start;
`;
