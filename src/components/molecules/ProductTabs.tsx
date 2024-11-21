import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Divider, Stack, TP } from '@/src/components/atoms';
import DOMPurify from 'dompurify';

export const ProductTabs: React.FC<{
    data: { title: string; children: React.ReactNode | string }[];
    defaultOpenIndex?: number;
}> = ({ data, defaultOpenIndex = 0 }) => {
    const [activeTab, setActiveTab] = useState<number>(
        data.length > 0 ? defaultOpenIndex : -1
    );

    if (!data || data.length === 0) {
        return <EmptyMessage>No tabs available for this product.</EmptyMessage>;
    }

    return (
        <TabWrapper>
            <TabHeaders role="tablist">
                {data.map((entry, index) => (
                    <TabHeader
                        key={index}
                        active={activeTab === index}
                        onClick={() => setActiveTab(index)}
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`tab-content-${index}`}
                        id={`tab-header-${index}`}
                    >
                        {entry.title}
                    </TabHeader>
                ))}
            </TabHeaders>
            <Divider />
            <Content
                id={`tab-content-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-header-${activeTab}`}
            >
                {activeTab !== -1 &&
                    (data[activeTab]?.children ? (
                        typeof data[activeTab]?.children === 'string' ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        data[activeTab]?.children as string
                                    ),
                                }}
                            />
                        ) : (
                            data[activeTab]?.children
                        )
                    ) : (
                        <p>No content available for this tab.</p>
                    ))}
            </Content>
        </TabWrapper>
    );
};

// Styled Components
const TabWrapper = styled(Stack)`
    width: 100%;
    margin-top: 3.5rem;
    flex-direction: column;
    border: 1px solid ${({ theme }) => theme.border.main};
    padding: 30px;
    border-radius: 15px;
`;

const TabHeaders = styled.div`
    display: flex;
    gap: 2rem;
    border-bottom: 2px solid ${({ theme }) => theme.gray(100)};
`;

const TabHeader = styled.button<{ active: boolean }>`
    padding: 30px 0;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    font-size: 30px;
    font-weight: ${({ active }) => (active ? '800' : '400')};
    color: ${({ theme, active }) =>
            active ? theme.text.main : theme.text.subtitle};
    transition: color 0.3s ease-in-out;

    &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 6px;
        background-color: ${({ theme, active }) =>
                active ? theme.button.front : 'transparent'};
        transition: background-color 0.3s ease-in-out;
    }
`;

const Content = styled.div`
    margin-top: 30px;
    font-size: 18px;
    line-height: 26px;
    color: ${({ theme }) => theme.text.subtitle};
`;

const EmptyMessage = styled.div`
    text-align: center;
    font-size: 18px;
    color: ${({ theme }) => theme.text.subtitle};
    padding: 20px;
    border: 1px solid ${({ theme }) => theme.border.main};
    border-radius: 10px;
`;

