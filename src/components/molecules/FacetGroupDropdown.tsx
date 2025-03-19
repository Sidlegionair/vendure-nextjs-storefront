import React, { useState, useRef } from 'react';
import { Stack, TP } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
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

    // Get the selected values (both their id and name).
    const selectedOptions = facetGroup.values.filter((v) => selected.includes(v.id));
    const selectedNames = selectedOptions.map((v) => v.name);
    // If there are selected options, display them after the facet group name.
    const displayText = selectedNames.length > 0 ? selectedNames.join(', ') : '';

    // Reset function: remove all active filters for this group.
    const resetFilters = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling the dropdown.
        selectedOptions.forEach((value) => {
            onToggleFilter(facetGroup, value);
        });
    };

    return (
        <DropdownContainer ref={ref}>
            <DropdownHeader
                selected={selectedOptions.length > 0}
                onClick={() => setOpen(!open)}
            >
                <Stack column>
                    <small>
                        <b>{facetGroup.name}</b>
                    </small>
                    <SelectedText>{displayText}</SelectedText>
                </Stack>
                <Stack itemsCenter justifyCenter>
                    {/* Only show reset button if there are active selections, otherwise show the chevron */}
                    {selectedOptions.length > 0 ? (
                        <ResetIcon onClick={resetFilters}>
                            <X size={16} />
                        </ResetIcon>
                    ) : (
                        <ChevronIcon>
                            <ChevronDown />
                        </ChevronIcon>
                    )}
                </Stack>
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
                                <small>{value.name}</small>
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

const DropdownContainer = styled(Stack)`
    position: relative;
`;

const DropdownHeader = styled(Stack)<{ selected: boolean }>`
    align-items: start;
    justify-content: space-between;
    cursor: pointer;
    padding: 15px 15px 5px 15px;
    min-height: 65px;
    gap: 15px;
    min-width: 188px;
    border: 1px solid #4d4d4d;
    border-radius: 8px;
    background-color: ${({ theme, selected }) =>
            selected ? theme.background.accent : theme.background.main};
    color: ${({ theme, selected }) =>
            selected ? theme.background.main : 'inherit'};
`;

const SelectedText = styled.small`
    flex-grow: 1;
    font-size: 14px;
    font-weight: 300;
    text-align: left;
`;

const ResetIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
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
    background-color: ${({ theme, selected }) =>
            selected ? theme.background.accent : 'unset'};
    color: ${({ theme, selected }) =>
            selected ? theme.background.main : 'inherit'};
    &:hover {
        background-color: ${({ theme }) => theme.background.third};
        color: ${({ theme, selected }) =>
                selected ? theme.text.main : 'inherit'};

    }
`;
