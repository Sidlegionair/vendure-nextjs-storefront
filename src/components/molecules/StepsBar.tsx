import React from 'react';
import styled from '@emotion/styled';

interface StepsBarProps {
    steps: string[];
    currentStep: number; // 1-based index for the active step
}

export const StepsBar: React.FC<StepsBarProps> = ({ steps, currentStep }) => {
    const progressWidth =
        steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

    return (
        <Container>
            <StepsRow>
                <LineContainer>
                    <LineBackground />
                    <LineProgress progressWidth={progressWidth} />
                </LineContainer>
                {steps.map((stepLabel, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <StepItem key={index}>
                            <Circle isActive={isActive} isCompleted={isCompleted}>
                                {stepNumber}
                            </Circle>
                            <StepLabel isActive={isActive} isCompleted={isCompleted}>
                                {stepLabel}
                            </StepLabel>
                        </StepItem>
                    );
                })}
            </StepsRow>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    max-width: 900px;
    margin: 2rem auto;
`;

const StepsRow = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: fit-content; /* match circle diameter */
`;

// New container that limits the line width to ~90% of the row
const LineContainer = styled.div`
    position: absolute;
    top: 30%;
    left: 5%;
    width: 90%;
    height: 2px;
    transform: translateY(-50%);
    z-index: 1;
`;

const LineBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ccc;
`;

interface ProgressProps {
    progressWidth: number;
}

const LineProgress = styled.div<ProgressProps>`
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.background.accent};
    transition: width 0.3s ease;
    width: ${({ progressWidth }) => `${progressWidth}%`};
`;

const StepItem = styled.div`
    position: relative;
    z-index: 2; /* circles above the line */
    display: flex;
    flex-direction: column;
    align-items: center;
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

    ${({ isCompleted, theme }) =>
            isCompleted &&
            `
      background-color: ${theme.background.accent};
      border-color: ${theme.background.accent};
      color: #fff;
    `}

    ${({ isActive, isCompleted, theme }) =>
            isActive &&
            !isCompleted &&
            `
      border-color: ${theme.background.accent};
      color: ${theme.background.accent};
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

    ${({ isActive, isCompleted, theme }) =>
            isActive &&
            !isCompleted &&
            `
      color: ${theme.background.accent};
    `}
`;
