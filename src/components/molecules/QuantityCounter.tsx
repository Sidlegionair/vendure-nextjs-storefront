import { Stack } from '@/src/components/atoms';
import { IconButton } from '@/src/components/molecules/Button';
import styled from '@emotion/styled';
import { Minus, Plus } from 'lucide-react';

interface QuantityCounterProps {
    onChange: (v: number) => void;
    v: number;
    size?: string; // Icon and font size
    height?: string; // Overall height of the component
}

export const QuantityCounter = ({
    onChange,
    v,
    size = '16px', // Default icon and font size
    height = '35px', // Default overall height
}: QuantityCounterProps) => {
    return (
        <Main>
            <IconButtonStatic height={height} onClick={() => onChange(v - 1)}>
                <MinWidth>
                    <Minus size={size} />
                </MinWidth>
            </IconButtonStatic>
            <span style={{ fontSize: size, lineHeight: height }}>{v}</span>
            <IconButtonStatic height={height} onClick={() => onChange(v + 1)}>
                <MinWidth>
                    <Plus size={size} />
                </MinWidth>
            </IconButtonStatic>
        </Main>
    );
};

const MinWidth = styled.div`
    display: flex;

    align-items: center;
    justify-content: center;
`;

const IconButtonStatic = styled(IconButton)<{ height?: string }>`
    height: ${({ height }) => {
        const numericValue = parseFloat(height || '0');
        const unit = height?.replace(/[\d.]/g, '') || 'px'; // Extract unit or default to 'px'
        return `${numericValue - 1}${unit}`;
    }};
    width: ${({ height }) => height}; // Width remains the same as height
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; // Remove default padding for better customization
`;

const Main = styled(Stack)<{ height?: string }>`
    width: fit-content;
    height: ${({ height }) => height};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.border.main};
    border-radius: 8px;
    color: ${({ theme }) => theme.text.main};
    font-weight: 600;
    span {
        margin: 0 1rem;
        font-weight: 600;
        user-select: none;
    }
`;
