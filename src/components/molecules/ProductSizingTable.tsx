import React from 'react';
import styled from '@emotion/styled';
import { ProductDetailType } from '@/src/graphql/selectors';

type Field = {
    key: string;
    label: string;
};

type ProductSizingTableProps = {
    product: ProductDetailType;
    fields: Field[];
};

export const ProductSizingTable: React.FC<ProductSizingTableProps> = ({ product, fields }) => {
    if (!product?.variants?.length || !fields?.length) {
        return <div>No sizing data available.</div>;
    }

    return (
        <TableContainer>
            <Table>
                <thead>
                <tr>
                    <th>Specification</th>
                    {product.variants.map((variant) => (
                        <th key={variant.id}>{variant.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {fields.map((field) => (
                    <tr key={field.key}>
                        <td><b>{field.label}</b></td>
                        {product.variants.map((variant) => (
                            <td key={`${variant.id}-${field.key}`}>
                                {typeof variant.customFields?.[field.key as keyof typeof variant.customFields] ===
                                'string' ||
                                typeof variant.customFields?.[field.key as keyof typeof variant.customFields] ===
                                'number'
                                    ? variant.customFields[field.key as keyof typeof variant.customFields]
                                    : 'N/A'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

const TableContainer = styled.div`
    overflow-x: auto;
    margin: 20px 0;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f9f9f9;
    }
`;
