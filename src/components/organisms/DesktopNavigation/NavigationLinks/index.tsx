import { CollectionTileType } from '@/src/graphql/selectors';
import { RootNode } from '@/src/util/arrayToTree';
import { Link, Stack, TH2 } from '@/src/components/atoms';
import styled from '@emotion/styled';

export const NavigationLinks: React.FC<{ collection: RootNode<CollectionTileType>['children'][number] }> = ({
                                                                                                                collection,
                                                                                                            }) => {
    return (
        <Stack column gap={22}>
            <TH2>{collection.name}</TH2>
            <LinkWrapper column>
                {collection.children.map(cc => {
                    const href =
                        cc.parent?.slug === '__root_collection__'
                            ? `/collections/${cc.slug}`
                            : `/collections/${cc.parent?.slug}/${cc.slug}`;

                    // Determine if current link represents a submenu by checking if it has children
                    const isSubMenu = cc.children && cc.children.length > 0;

                    return (
                        <Stack key={cc.name + '1'} style={{ padding: '0.5rem' }}>
                            <NavigationLink href={href} isSubMenu={isSubMenu}>{cc.name}</NavigationLink>
                        </Stack>
                    );
                })}
            </LinkWrapper>
        </Stack>
    );
};

const LinkWrapper = styled(Stack)`
    a {
        color: ${p => p.theme.text.subtitle};
    }
`;

const NavigationLink = styled(Link)<{ isSubMenu?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => p.theme.text.inactive};
    white-space: nowrap;
    font-style: normal;

    /* Desktop styles (you can adjust these as needed) */
    font-weight: ${({ isSubMenu }) => (isSubMenu ? 400 : 600)};
    font-size: ${({ isSubMenu }) => (isSubMenu ? '18px' : '20px')};
    line-height: ${({ isSubMenu }) => (isSubMenu ? '18px' : '20px')};

    &:hover {
        color: ${p => p.theme.text.main};
    }

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        /* On mobile, apply the requested exact styling */
        font-weight: ${({ isSubMenu }) => (isSubMenu ? 400 : 600)};
        font-size: ${({ isSubMenu }) => (isSubMenu ? '18px' : '20px')};
        line-height: ${({ isSubMenu }) => (isSubMenu ? '18px' : '20px')};
    }
`;
