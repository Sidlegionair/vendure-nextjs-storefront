import React from 'react';
import { TP, Stack, Link } from '@/src/components/atoms';
import styled from '@emotion/styled';
import { Home } from 'lucide-react';

export const Breadcrumbs: React.FC<{
    breadcrumbs: {
        name: string | undefined;
        href: string;
    }[];
}> = ({ breadcrumbs }) => {
    return (
        <Stack itemsCenter>
            {breadcrumbs.map((b, i) => {
                const isHome = i === 0;
                const isLast = i === breadcrumbs.length - 1;
                return (
                    <Stack itemsCenter gap="0.5rem" key={b.name}>
                        <StyledLink skipChannelHandling href={b.href} blocked={isLast ? 1 : 0}>
                            <Stack itemsCenter gap="0.5rem">
                                {isHome && <Home size={16} />}
                                <StyledTP isLast={isLast} size="1.25rem">
                                    {b.name}
                                </StyledTP>
                            </Stack>
                        </StyledLink>
                        {!isLast && (skipChannelHandling
                            <StyledTP size="1.25rem" isLast={isLast}>
                                /&nbsp;
                            </StyledTP>
                        )}
                    </Stack>
                );
            })}
        </Stack>
    );
};

const StyledLink = styled(Link)<{ blocked?: number }>`
    text-decoration: none;
    pointer-events: ${p => (p.blocked === 1 ? 'none' : 'auto')};
    color: ${p => p.theme.background.main};
`;

const StyledTP = styled(TP)<{ isLast?: boolean }>`
        font-family: 'Calibri', sans-serif; 
        opacity: ${p => (p.isLast ? 1 : '0.4')};
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    
        text-decoration: none;
        pointer-events: ${p => (p.isLast ? 'none' : 'auto')};
        //color: ${p => p.theme.background.main};
`;
