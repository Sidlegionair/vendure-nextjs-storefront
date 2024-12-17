import { Divider, Stack, TFacetHeading } from '@/src/components/atoms';
import { FiltersFacetType } from '@/src/graphql/selectors';
import styled from '@emotion/styled';
import { CheckBox } from '@/src/components/forms';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FacetCheckBox } from '@/src/components/forms/FacetCheckbox';

interface FacetProps {
    facet: FiltersFacetType;
    selected?: string[];
    onClick: (group: { id: string; name: string }, facet: { id: string; name: string }) => void;
}

export const FacetFilterCheckbox: React.FC<FacetProps> = ({ facet: { id, name, values }, onClick, selected }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <GridWrapper w100 column>
            <StyledDivider></StyledDivider>
            <GridTitle onClick={() => setOpen(!open)}>
                <StyledTFacetHeading capitalize size="1.5rem">
                    {name}
                </StyledTFacetHeading>
                <IconWrapper>
                    <ChevronDown />
                </IconWrapper>
            </GridTitle>
            <Grid open={open}>
                <GridEntry>
                    <CheckGrid>
                        {values.map(v => {
                            const isSelected = selected?.includes(v.id);
                            return (
                                <FacetCheckBox
                                    key={v.id}
                                    label={`${v.name}`}
                                    count={`(${v.count})`}
                                    checked={isSelected}
                                    onChange={() => onClick({ id, name }, v)}
                                />
                            );
                        })}
                    </CheckGrid>
                </GridEntry>
            </Grid>
        </GridWrapper>
    );
};

const StyledDivider = styled(Divider)`   
    margin-bottom: 18px;
`


const StyledTFacetHeading = styled(TFacetHeading)`
    /* Brand */

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;



`


const GridWrapper = styled(Stack)`
    //margin-top: 1.7rem;
    //min-width: 420px;
    max-width: 100%;
`;

const Grid = styled.div<{ open: boolean }>`
    margin-top: 19px;
    display: grid;
    grid-template-rows: ${({ open }) => (open ? '1fr' : '0fr')};
    transition: grid-template-rows 0.3s ease-in-out;
    border-bottom: 1px solid ${p => p.theme.gray(100)};
`;

const GridTitle = styled.button`
    width: 100%;
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const GridEntry = styled(Stack)`
    overflow: hidden;
`;

const CheckGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr; /* Changed from '1fr 1fr' to '1fr' */
    gap: 2rem;
    padding-bottom: 2rem;
    width: 100%;

    & > label {
        font-size: 1.5rem;
        letter-spacing: -0.64px;
        margin-left: 0.5rem;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
