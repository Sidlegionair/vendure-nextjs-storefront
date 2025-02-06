import React, { useState, useRef } from 'react';
import { Stack, TP } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useOutsideClick } from '@/src/util/hooks/useOutsideClick';

export interface FacetValue {
    id: string;
    name: string;
}

export interface FacetGroup {
    id: string;
    name: string;
    code?: string;
    values: FacetValue[];
}

interface FacetGroupDropdownProps {
    facetGroup: FacetGroup;
    selected: string[]; // Array of selected facet value IDs.
    onToggleFilter: (group: FacetGroup, value: FacetValue) => void;
}

export const FacetGroupDropdown: React.FC<FacetGroupDropdownProps> = ({
                                                                          facetGroup,
                                                                          selected,
                                                                          onToggleFilter,
                                                                      }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, () => setOpen(false));

    // If no value is selected, show the facet group name; otherwise, list selected values.
    const selectedNames = facetGroup.values
        .filter((v) => selected.includes(v.id))
        .map((v) => v.name);
    const displayText =
        selectedNames.length > 0 ? selectedNames.join(', ') : '';

    return (
        <DropdownContainer ref={ref}>
            <DropdownHeader onClick={() => setOpen(!open)}>
                <TP weight={600} size="14px">
                    {facetGroup.name}
                </TP>
                <SelectedText>{displayText}</SelectedText>
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
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        {facetGroup.values.map((value) => (
                            <DropdownItem
                                key={value.id}
                                selected={selected.includes(value.id)}
                                onClick={() => onToggleFilter(facetGroup, value)}
                            >
                                <TP size="1.5rem" weight={400}>
                                    {value.name}
                                </TP>
                                {selected.includes(value.id) && (
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

const DropdownContainer = styled.div`
    position: relative;
    margin-right: 1rem;
`;

const DropdownHeader = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.75rem 1rem;
    border: 1px solid #4d4d4d;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.background.main};
`;

const SelectedText = styled.div`
    flex-grow: 1;
    font-size: 14px;
    font-weight: 300;
    margin: 0 0.5rem;
    text-align: left;
`;

const ChevronIcon = styled.div`
    display: flex;
    align-items: center;
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
    background-color: ${({ theme, selected }) =>
    selected ? theme.background.third : 'unset'};
    &:hover {
        background-color: ${({ theme }) => theme.background.third};
    }
`;
