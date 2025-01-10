import React from 'react';
import { Stack } from '@/src/components';
import styled from '@emotion/styled';

interface OptionTabContentProps {
    customFields?: Record<string, any>;
    tabIndex: number;
}

export const OptionTabContent: React.FC<OptionTabContentProps> = ({ customFields, tabIndex }) => {
    const MAX_BARS = 4;

    const bars = Array.from({ length: MAX_BARS }, (_, j) => j + 1)
        .filter(
            barIndex => customFields?.[`optionTab${tabIndex}Bar${barIndex}Visible`]
        )
        .map(barIndex => ({
            name: customFields?.[`optionTab${tabIndex}Bar${barIndex}Name`] || `Bar ${barIndex}`,
            min: customFields?.[`optionTab${tabIndex}Bar${barIndex}Min`] || 0,
            max: customFields?.[`optionTab${tabIndex}Bar${barIndex}Max`] || 100,
            steps: customFields?.[`optionTab${tabIndex}Bar${barIndex}Steps`] || 10,
            value: customFields?.[`optionTab${tabIndex}Bar${barIndex}Rating`] || 0,
            minLabel: customFields?.[`optionTab${tabIndex}Bar${barIndex}MinLabel`] || '',
            maxLabel: customFields?.[`optionTab${tabIndex}Bar${barIndex}MaxLabel`] || '',
        }));


    return (
        <Stack column gap="1rem">
            {bars.map((bar, idx) => (
                <BarContainer key={idx}>
                    <BarLabel>
                        <strong>{bar.name}</strong>
                    </BarLabel>
                    <BarRangeContainer>
                        <BarRange value={bar.value} max={bar.max} steps={bar.steps} />
                    </BarRangeContainer>
                    {(bar.minLabel || bar.maxLabel) && (
                        <BarLabels>
                            <span>{bar.minLabel || bar.min}</span>
                            <span>{bar.maxLabel || bar.max}</span>
                        </BarLabels>
                    )}
                </BarContainer>
            ))}
        </Stack>
    );
};

const BarRangeContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
`;

const BarLabels = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: 400;
    font-size: 16px;
    color: ${({ theme }) => theme.text.main};
`;

const BarContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const BarLabel = styled.div`
    font-weight: 400;
    color: ${({ theme }) => theme.text.main};
    font-size: 18px;
    line-height: 18px;
`;

const BarRangeWrapper = styled.div`
    display: flex;
    justify-content: center;    
    align-items: center;
    width: 100%;
    padding: 3px;
    //padding-right: 3px;
    height: 14px;
    border: 0.5px solid #D4D4D4;
    border-radius: 15px;
    overflow: hidden; /* Ensures the border radius applies cleanly */
`;

const BarRange: React.FC<{ value: number; max: number; steps: number }> = ({ value, max, steps }) => {
    const activeSteps = Math.ceil((value / max) * steps);

    return (
        <BarRangeWrapper>
            {Array.from({ length: steps }, (_, index) => (
                <div
                    key={index}
                    style={{
                        flex: 1,
                        height: '100%',
                        backgroundColor: index < activeSteps ? '#0E4632' : '#d5d5d5',
                        borderRight: index < steps - 1 ? '1px solid #ffffff' : 'none',
                        borderRadius:
                            index === 0
                                ? '15px 0 0 15px' // Rounded on the left for the first step
                                : index === steps - 1
                                    ? '0 15px 15px 0' // Rounded on the right for the last step
                                    : '0', // No rounding for middle steps
                        transition: 'background-color 0.3s ease-in-out',
                    }}
                />
            ))}
        </BarRangeWrapper>
    );
};
