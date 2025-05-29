import styled from '@emotion/styled';
import { Stack, TypoGraphy } from '@/src/components';
import { PropsWithChildren } from 'react';

interface PopularSearchesProps extends PropsWithChildren {
    popularSearches: string[];
    onClick: (item: string) => void;
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({ children, popularSearches, onClick }) => {
    return (
        <Stack column gap="24px">
            {children}
            <PopularSearchesWrapper gap="16px">
                {popularSearches &&
                    popularSearches.map(item => (
                        <TypoGraphy
                            key={item}
                            size={'18px'}
                            weight={400}
                            onClick={() => onClick(item)}
                            style={{ cursor: 'pointer', opacity: 0.5 }}>
                            {item}
                        </TypoGraphy>
                    ))}
            </PopularSearchesWrapper>
        </Stack>
    );
};

const PopularSearchesWrapper = styled(Stack)`
    flex-direction: row;

    @media (min-width: ${p => p.theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;
