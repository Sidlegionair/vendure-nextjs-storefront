import React from 'react';
import styled from '@emotion/styled';
import { Stack } from '@/src/components/atoms/Stack';

interface StepsBarProps {
    steps: string[];
    currentStep: number;
}

/**
 * A basic steps bar that displays steps and highlights the current step.
 */
export const StepsBar: React.FC<StepsBarProps> = ({ steps, currentStep }) => {
    return (
        <StepsBarContainer>
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <StepItem key={index} isActive={isActive} isCompleted={isCompleted}>
                        <StepCircle>{stepNumber}</StepCircle>
                        <StepLabel>{step}</StepLabel>
                    </StepItem>
                );
            })}
        </StepsBarContainer>
    );
};

const StepsBarContainer = styled(Stack)`
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
`;

const StepItem = styled.div<{ isActive: boolean; isCompleted: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1rem;

    /* Example styling logic; tweak as you wish */
    opacity: ${({ isActive, isCompleted }) => (isActive || isCompleted ? 1 : 0.4)};
`;

const StepCircle = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: #cc0000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
`;

const StepLabel = styled.div`
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
`;
