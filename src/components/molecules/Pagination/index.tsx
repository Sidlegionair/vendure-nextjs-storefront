import { Stack } from '@/src/components/atoms/Stack';
import { usePagination } from './hooks';
import styled from '@emotion/styled';

export const Pagination: React.FC<{
    page: number;
    changePage: (page: number) => void;
    totalPages: number;
}> = ({ page, changePage, totalPages }) => {
    if (totalPages === 1) return null;
    const { items } = usePagination({ page, totalPages });
    return (
        <PaginationWrapper w100 justifyCenter itemsCenter gap="1rem">
            {totalPages > 1 ? (
                items.map(({ text, page, isCurrent }) => (
                    <PaginationText
                        key={text}
                        onClick={() => {
                            const element = document.getElementById('collection-scroll');
                            element?.scrollIntoView({ behavior: 'smooth' });
                            changePage(page);
                        }}
                        isCurrent={isCurrent}>
                        {text}
                    </PaginationText>
                ))
            ) : (
                <PaginationText isCurrent={true}>1</PaginationText>
            )}
        </PaginationWrapper>
    );
};

const PaginationWrapper = styled(Stack)`
    margin: 70px 0;
    display: flex;
    gap: 15px;
`;

const PaginationText = styled.a<{ isCurrent?: boolean }>`
    font-size: 18px;

    font-weight: 500;
    color: ${p => (p.isCurrent ? p.theme.text.accent : p.theme.text.subtitle)};
    cursor: pointer;
`;
