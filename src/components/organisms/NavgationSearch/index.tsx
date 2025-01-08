import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, SearchIcon, X } from 'lucide-react';
import styled from '@emotion/styled';
import { Link, Stack, TP, TypoGraphy } from '@/src/components/atoms';
import { ProductImageWithInfo } from '../../molecules/ProductImageWithInfo';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigationSearch } from './hooks';
import { PopularSearches } from './PopularSearches';

export const NavigationSearch: React.FC<ReturnType<typeof useNavigationSearch>> = ({
                                                                                       loading,
                                                                                       searchQuery,
                                                                                       searchResults,
                                                                                       totalItems,
                                                                                       setSearchQuery,
                                                                                       closeSearch,
                                                                                       onSubmit,
                                                                                   }) => {
    const { t } = useTranslation('common');
    const popularSearches = ['Dupraz', 'D1', 'Snowboards'];

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const handleFocus = () => setIsPanelVisible(true);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsPanelVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeSearch();
            }
        };
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [closeSearch]);

    // Removed the automatic focus on component mount

    return (
        <ResponsiveStack itemsCenter ref={containerRef}>
            <Stack w100 itemsCenter gap="1rem">
                <Form onSubmit={onSubmit}>
                    <Input
                        onKeyDown={e => {
                            if (e.key === 'Escape') {
                                closeSearch();
                                setIsPanelVisible(false);
                            }
                        }}
                        ref={inputRef}
                        placeholder={t('search-for-best-products')}
                        value={searchQuery}
                        onFocus={handleFocus}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setIsPanelVisible(true);
                        }}
                        type="text"
                    />
                    {searchQuery ? (
                        <SearchButton onClick={() => {
                            setSearchQuery('');
                            closeSearch();
                            setIsPanelVisible(false);
                        }}>
                            <X size="1.5rem" />
                        </SearchButton>
                    ) : (
                        <SearchIconContainer>
                            <SearchIcon size="18px" />
                        </SearchIconContainer>
                    )}
                </Form>
            </Stack>
            {isPanelVisible && (
                <SearchPosition w100>
                    <SearchContent w100>
                        <PopularSearchesWrapper>
                            <PopularSearches popularSearches={popularSearches} onClick={item => setSearchQuery(item)}>
                                <MobileHeading size="20px" weight={600} noWrap>
                                    {t('popular-searches-heading')}
                                </MobileHeading>
                            </PopularSearches>
                        </PopularSearchesWrapper>
                        <SearchResultsWrapper>
                        {searchQuery.length === 0 ? (
                            <Stack column gap='16px'>
                                <MobileHeading size={'18px'} weight={400}>{t('search-query-start-typing')}</MobileHeading>
                                <MobileHeadingOpacity size={'18px'} weight={300}>{t('search-query-to-short')}</MobileHeadingOpacity>
                            </Stack>
                        ) : searchQuery.length < 3 ? (
                            <MobileText>{t('search-query-to-short')}</MobileText>
                        ) : loading ? (
                            <Stack column gap='24px'>
                                <MobileHeading size="20px" weight={600} noWrap>
                                    {t('search-results-header')}
                                </MobileHeading>
                                <MobileText>{t('search-results-loading')}</MobileText>

                            </Stack>
                        ) : searchResults.length === 0 ? (
                            <Stack column gap={'16px'}>
                                <MobileText>
                                    <Trans
                                        i18nKey="search-results-no-results"
                                        values={{ searchQuery }}
                                        components={{ 1: <strong></strong> }}
                                    />

                                </MobileText>
                                <MobileHeadingOpacity size={'18px'} weight={300}>{t('search-query-try-searching-something-else')}</MobileHeadingOpacity>

                            </Stack>
                        ) : (
                            <Wrapper column w100 gap={'2rem'}>
                                <Container>
                                    <Stack column w100 gap={'2rem'}>
                                        <MobileHeading size="20px" weight={600} noWrap>
                                            {t('search-results-header')}
                                        </MobileHeading>
                                        <Results w100 flexWrap>
                                            {searchResults.slice(0, 6).map(result => (
                                                <ResultCard gap="0.5rem" itemsCenter column key={result.slug}>
                                                    <ProductImageWithInfo
                                                        size="thumbnail-big"
                                                        imageSrc={result.productAsset?.preview}
                                                        href={`/snowboards/${result.slug}`}
                                                    />
                                                    <Stack itemsCenter column gap="0.5rem">
                                                        <MobileText size="1.8rem" weight={500}>
                                                            {result.productName}
                                                        </MobileText>
                                                    </Stack>
                                                </ResultCard>
                                            ))}
                                        </Results>
                                    </Stack>
                                </Container>
                                <StyledLink href={`/search?q=${searchQuery}`}>
                                    <Trans
                                        i18nKey="search-results-total"
                                        components={{ 1: <strong></strong> }}
                                        values={{ totalItems, searchQuery }}
                                    />
                                    <IconWrapper>
                                        <ArrowRight size="1.5rem" />
                                    </IconWrapper>
                                </StyledLink>
                            </Wrapper>
                        )}
                        </SearchResultsWrapper>
                    </SearchContent>
                </SearchPosition>
            )}
        </ResponsiveStack>
    );
};

const ResponsiveStack = styled(Stack)`
    position: relative;
    width: 100%;

    
    @media (max-width: ${p => p.theme.breakpoints.md}) {
        padding: 0 1rem;
    }

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        width: 100%;
    }
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    align-self: flex-end;
    gap: 0.5rem;
    width: fit-content;
    color: ${p => p.theme.gray(1000)};
    font-size: 1.5rem;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-family: 'Suisse BP Int\'l', sans-serif;
        font-size: 1.8rem;
        line-height: 1.8rem;
    }
`;

const PopularSearchesWrapper = styled(Stack)`
    width: 33.3%;
    max-width: 521px;
    display: flex;
    padding-top: 56px;
    justify-content: center;

    //padding: 56px;
    border-right: 0.5px solid ${p => p.theme.outline};
`

const SearchResultsWrapper = styled(Stack)`
    padding: 56px;
    width: 100%;
    //padding-left: calc(56px + 33.3%); /* Accounts for the width of the left div and adds 56px */
    display: flex;
    align-items: flex-start;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        padding-left: 56px; /* Adjust for smaller screens */
    }
`;

const Results = styled(Stack)`
    row-gap: 2rem;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        flex-direction: row;
    }
`;

const ResultCard = styled(Stack)`
    flex-basis: calc(100% / 2);
    @media (min-width: ${p => p.theme.breakpoints.ssm}) {
        flex-basis: calc(100% / 3);
    }
`;

const SearchPosition = styled(Stack)`
    position: absolute;
    top: calc(100% + 1rem);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    padding: 0 1rem;

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        max-width: 1120px;
        padding: 0;
    }
`;

const SearchContent = styled(Stack)`
    position: relative;
    width: 100%;
    min-height: 40vh;
    //padding: 0rem 4rem;
    border: 1px solid ${p => p.theme.gray(100)};
    //border-radius: ${({ theme }) => theme.borderRadius};
    outline: none;
    font-size: 1.5rem;
    color: ${p => p.theme.text.main};
    background: ${p => p.theme.background.main};
    transition: all 0.2s ease-in-out;
    overflow: hidden;

    flex-direction: column;
    gap: 2rem;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        flex-direction: row;
        justify-content: space-between;
    }
`;

const Form = styled.form`
    width: 50%;
    max-width: 675px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    left: 25%;
`;

const Input = styled.input`
    width: 100%;
    padding: 1rem 2rem 1rem 1.5rem; /* Left padding ensures text is not too close */
    padding-right: 3rem; /* Right padding to leave space for the icon or button */
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.15);
    border-radius: 37.5px;
    outline: none;
    font-size: 1.5rem;
    color: ${p => p.theme.text.main};
    background: ${p => p.theme.background.main};
    transition: all 0.2s ease-in-out;
    height: 40px;
    position: relative;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 14px;
        line-height: 14px;
    }

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        height: 55px;
    }
`;


const SearchIconContainer = styled.div`
    position: absolute;
    right: 1.5rem; /* Matches padding-right in Input */
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none; /* Prevent accidental clicks */
    svg {
        color: ${p => p.theme.text.accent};
    }
`;


const SearchButton = styled.button`
    position: absolute;
    right: 1.5rem; /* Matches padding-right in Input */
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    width: auto;
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;

    svg {
        color: ${p => p.theme.text.accent};
    }
`;

const Container = styled(Stack)`
    display: flex;
    width: 100%;
    flex-direction: column-reverse;
    gap: 2rem;

    @media (min-width: ${p => p.theme.breakpoints.lg}) {
        flex-direction: row;
        gap: unset;
        justify-content: space-between;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.25rem;
`;

const Wrapper = styled(Stack)``;

const MobileHeadingOpacity = styled(TypoGraphy)`
    opacity: 0.5;
    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 2rem;
        line-height: 2rem;
        font-weight: 600;
    }
`;


const MobileHeading = styled(TypoGraphy)`
    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 2rem;
        line-height: 2rem;
        font-weight: 600;
    }
`;

const MobileText = styled(TP)`

    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 18px;
    /* identical to box height */

    //color: #000000;
    //
    //opacity: 0.5;
    

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: 1.8rem;
        line-height: 1.9rem;
        font-weight: 400;
    }
`;
