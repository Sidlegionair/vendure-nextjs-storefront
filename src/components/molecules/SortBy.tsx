import { sortOptions } from '@/src/state/collection/utils';
import React, { useRef, useState } from 'react';
import { Stack } from '@/src/components/atoms';
import { Sort } from '@/src/state/collection/types';
import { useTranslation } from 'next-i18next';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/src/util/hooks/useOutsideClick';
import { ChevronDown, Check } from 'lucide-react';

interface Props {
    sort: Sort;
    handleSort: (sort: Sort) => Promise<void>;
}

export const SortBy: React.FC<Props> = ({ handleSort, sort }) => {
    const { t } = useTranslation('collections');
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, () => setOpen(false));

    const selectedOption = `${sort.key} (${t(`sort-directions.${sort.direction}`)})`;

    return (
        <DropdownContainer ref={ref}>
            <DropdownHeader onClick={() => setOpen(!open)}>
                <Stack column>
                    <StyledSmall>
                        <b>{t('sort-by')}</b>
                    </StyledSmall>
                    <SelectedText>{selectedOption}</SelectedText>
                </Stack>
                <ChevronIcon>
                    <ChevronDown />
                </ChevronIcon>
            </DropdownHeader>
            <AnimatePresence>
                {open && (
                    <DropdownList
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}>
                        {sortOptions.map(o => (
                            <DropdownItem
                                key={o.key + o.direction}
                                selected={o.key === sort.key && o.direction === sort.direction}
                                onClick={async () => {
                                    setOpen(false);
                                    await handleSort(o);
                                }}>
                                <small>
                                    {o.key} ({t(`sort-directions.${o.direction}`)})
                                </small>
                                {o.key === sort.key && o.direction === sort.direction && (
                                    <CheckIcon>
                                        <Check />
                                    </CheckIcon>
                                )}
                            </DropdownItem>
                        ))}
                    </DropdownList>
                )}
            </AnimatePresence>
        </DropdownContainer>
    );
};

const DropdownContainer = styled(Stack)`
    position: relative;
    margin-left: 15px;
`;

const DropdownHeader = styled(Stack)`
    align-items: start;
    justify-content: space-between;
    cursor: pointer;
    padding: 15px 15px 5px 15px;
    min-height: 65px;
    gap: 15px;
    min-width: 188px;
    border: 1px solid #4d4d4d;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.background.main};
`;

const SelectedText = styled.small`
    flex-grow: 1;
    font-size: 14px;
    font-weight: 300;
    text-align: left;
`;

const StyledSmall = styled.small`
    text-align: left;
`;

const ChevronIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
`;

const CheckIcon = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

const DropdownList = styled(motion.div)`
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    z-index: 100;
    background: ${({ theme }) => theme.background.main};
    border: 1px solid ${({ theme }) => theme.button.back};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const DropdownItem = styled.div<{ selected: boolean }>`
    cursor: pointer;
    padding: 1rem;
    display: flex;
    align-items: center;
    background-color: ${({ theme, selected }) => (selected ? theme.background.third : 'unset')};
    &:hover {
        background-color: ${({ theme }) => theme.background.third};
    }
`;
