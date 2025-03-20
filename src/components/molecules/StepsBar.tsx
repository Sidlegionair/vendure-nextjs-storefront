import React from 'react';
import styled from '@emotion/styled';

interface StepsBarProps {
    steps: string[];
    currentStep: number; // 1-based index for the active step
}

export const StepsBar: React.FC<StepsBarProps> = ({ steps, currentStep }) => {
    return (
        <StepsContainer>
            {steps.map((stepLabel, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                return (
                    <React.Fragment key={index}>
                        <StepItem>
                            <Circle isActive={isActive} isCompleted={isCompleted}>
                                {stepNumber}
                            </Circle>
                            <StepLabel isActive={isActive} isCompleted={isCompleted}>
                                {stepLabel}
                            </StepLabel>
                        </StepItem>
                        {index < steps.length - 1 && (
                            <Connector isCompleted={stepNumber < currentStep} />
                        )}
                    </React.Fragment>
                );
            })}
        </StepsContainer>
    );
};

const StepsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure items are spread out */
    width: 100%;
    max-width: 900px;
    margin: 2rem auto;
`;

const StepItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0; /* Prevent the circle from shrinking */
`;

interface CircleProps {
    isActive: boolean;
    isCompleted: boolean;
}

const Circle = styled.div<CircleProps>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    border: 2px solid #ccc;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s ease;

    ${({ isCompleted }) =>
            isCompleted &&
            `
      background-color: #cc0000;
      border-color: #cc0000;
      color: #fff; 
    `}

    ${({ isActive, isCompleted }) =>
            isActive &&
            !isCompleted &&
            `
      border-color: #cc0000;
      color: #cc0000;
    `}
`;

interface LabelProps {
    isActive: boolean;
    isCompleted: boolean;
}

const StepLabel = styled.div<LabelProps>`
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #666;
    transition: color 0.3s ease;

    ${({ isCompleted }) =>
            isCompleted &&
            `
      color: #000; 
    `}

    ${({ isActive, isCompleted }) =>
            isActive &&
            !isCompleted &&
            `
      color: #cc0000;
    `}
`;

interface ConnectorProps {
    isCompleted: boolean;
}

/*
  The connector expands to fill the gap between circles.
  Adding a min-width ensures that even if space is tight,
  you see a line.
*/
const Connector = styled.div<ConnectorProps>`
    flex: 1;
    //padding: 20px 0px;
    //min-width: 60px;
    height: 2px;
    //margin:  8px -25px;
    background-color: #ccc;
    transition: background-color 0.3s ease;

    ${({ isCompleted }) =>
            isCompleted &&
            `
      background-color: #cc0000;
    `}
`;
