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
                        <td>{field.label}</td>
                        {product.variants.map((variant) => (
                            <td key={`${variant.id}-${field.key}`}>
                                {typeof variant.customFields?.[field.key as keyof typeof variant.customFields] === 'string' ||
                                typeof variant.customFields?.[field.key as keyof typeof variant.customFields] === 'number'
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
    margin: 20px 0;
    max-height: 400px; /* fixed height for vertical scrolling */
    overflow: auto;    /* enables both vertical and horizontal scrolling */
    width: 100%;
    position: relative;
    /* Optionally, add a border to the container */
    /* border: 1px solid #ddd; */
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

    /* Sticky header cells */
    th {
        background-color: #f4f4f4;
        position: sticky;
        top: 0;
        z-index: 10;
        background-clip: padding-box;
        /* Force a visible top border with a pseudo-element */
        &::before {
            content: "";
            position: absolute;
            top: -1px; /* position above the cell */
            left: 0;
            right: 0;
            border-top: 1px solid #ddd;
            pointer-events: none;
        }
    }

    /* Make the first column sticky horizontally */
    thead th:first-child {
        left: 0;
        z-index: 11;
    }

    tbody td:first-child {
        position: sticky;
        left: 0;
        background-color: #fff;
        font-weight: bold;
        z-index: 9;
        background-clip: padding-box;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f9f9f9;
    }
`;
