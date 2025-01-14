// src/components/molecules/ProductSpecsTable.tsx

import React from 'react';
import styled from '@emotion/styled';

interface ProductSpec {
    label: string;
    value: string | number | JSX.Element;
}

interface ProductSpecsTableProps {
    specs: ProductSpec[];
}

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ specs }) => {
    return (
        <Table>
            <tbody>
            {specs.map((spec, index) => (
                <Row key={index}>
                    <CellLabel>{spec.label}</CellLabel>
                    <CellValue>{spec.value}</CellValue>
                </Row>
            ))}
            </tbody>
        </Table>
    );
};

// Styled Components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
`;

const Row = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.gray(200)};
`;

const CellLabel = styled.td`
  padding: 0.75rem;
  font-weight: 600;
  width: 30%;
  vertical-align: top;
`;

const CellValue = styled.td`
  padding: 0.75rem;
  color: ${({ theme }) => theme.text.main};
`;
