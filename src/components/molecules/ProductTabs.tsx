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
    // border-bottom: 2px solid ${({ theme }) => theme.gray(100)};
`;

const TabHeader = styled.button<{ active: boolean }>`
    padding-bottom: 20px;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    font-size: 30px;
    line-height: 30px;
    font-weight: ${({ active }) => (active ? '600' : '400')};
    color: ${({ theme }) => theme.text.main};
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
    
    @media(max-width: 767px) {
        font-size: 20px;
    }
`;

const Content = styled.div`
    display: flex;
    margin-top: 30px;
    font-family: 'Calibri', sans-serif;
    font-size: 18px;
    line-height: 26px;
    color: ${({ theme }) => theme.text.subtitle};

    div {
        display: flex;
        flex-direction: column;
        gap: 10px;

        h2 {
            font-size: 24px;
            line-height: 32px;
            font-weight: bold;
            color: ${({ theme }) => theme.text.main}; /* Assuming a primary color */
            margin: 0;
        }

        h3 {
            font-size: 20px;
            line-height: 28px;
            font-weight: 600;
            color: ${({ theme }) => theme.text.main}; /* Assuming a secondary color */
            margin: 0;
        }

        h4 {
            font-size: 18px;
            line-height: 26px;
            font-weight: 500;
            color: ${({ theme }) => theme.text.subtitle}; /* Matches the default text color */
            margin: 0;
        }

        p {
            font-size: 18px;
            line-height: 26px;
            color: ${({ theme }) => theme.text.subtitle};
            margin: 0;
            
            @media(max-width: 767px) {
                font-size: 16px;
                line-height: 24px;
            }
        }
    }
`;

const EmptyMessage = styled.div`
    text-align: center;
    font-size: 18px;
    color: ${({ theme }) => theme.text.subtitle};
    padding: 20px;
    border: 1px solid ${({ theme }) => theme.border.main};
    //margin-top: 3px;
    border-radius: 10px;
`;

