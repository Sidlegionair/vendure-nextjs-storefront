import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Stack, TP } from '@/src/components';
import { LogoAexol } from '@/src/assets';
import { Check, ChevronDown, XIcon } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { Trans, useTranslation } from 'next-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useChannels } from '@/src/state/channels';
import languageDetector from '@/src/lib/lngDetector';
import { useRouter } from 'next/router';
import { DEFAULT_CHANNEL, DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE, channels } from '@/src/lib/consts';
import { getFlagByCode } from '@/src/util/i18Helpers';
import { useOutsideClick } from '@/src/util/hooks/useOutsideClick';
import { Button } from '../../molecules/Button';
import { getStoryblokApi } from '@storyblok/react';

type FormValues = {
    channel: string;
    locale: string;
};

type Alternate = {
    full_slug: string;
};


export const Picker: React.FC<{
    changeModal?: {
        modal: boolean;
        channel: string;
        locale: string;
        country_name: string;
    };
}> = ({ changeModal }) => {
    const { channel, locale } = useChannels();
    const { t } = useTranslation('common');
    const { query, push, pathname, asPath } = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const fetchStoryblokAlternative = async (slug: string, language: string, newLang: string) => {
        try {
            const storyblokApi = getStoryblokApi();

            // Normalize slug by removing the channel and adding the current language
            const normalizedSlug = `${language}/content/${slug.replace(/^.*\/content\//, '')}`;

            const response = await storyblokApi.get(`cdn/stories/${normalizedSlug}`, { version: 'draft' });


            const story = response.data.story;

            // console.log(story.alternates[0]);
            return story.alternates?.find((alt: Alternate) => alt.full_slug.includes(`${newLang}/`)) || null;
        } catch (error) {
            console.error('Error fetching Storyblok alternative:', error);
            return null;
        }
    };

    const isStoryblokPage = async (slug: string, language: string): Promise<boolean> => {
        try {
            const storyblokApi = getStoryblokApi();

            // Normalize slug by removing the channel and adding the current language
            const normalizedSlug = `${language}/content/${slug.replace(/^.*\/content\//, '')}`;

            const response = await storyblokApi.get(`cdn/stories/${normalizedSlug}`, { version: 'draft' });


            return !!response.data.story; // Page exists if response contains a story
        } catch (error) {
            console.error(`Error checking Storyblok page for slug "${slug}" in language "${language}":`, error);
            return false;
        }
    };


    // Good to note for future notice, this was used to open the popup if lng was detected.
    useEffect(() => {
        // if (changeModal?.modal) setIsOpen(true);
    }, [changeModal?.modal]);

    const defaultChannel = channels.find(c => c.channel === channel)?.slug as string;
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, () => setIsOpen(false));

    const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            channel: defaultChannel,
            locale,
        },
        values: changeModal?.modal ? { channel: changeModal.channel, locale: changeModal.locale } : undefined,
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const newLang = data.locale;
        const channelAsLocale = channels.find((c) => c.slug === data.channel);
        const sameAsChannel = newLang === channelAsLocale?.slug;

        languageDetector.cache && languageDetector.cache(newLang);

        const haveChannel = pathname.includes('[channel]');
        const haveLocale = pathname.includes('[locale]');
        if (haveChannel && channelAsLocale) {
            document.cookie = `channel=${channelAsLocale.channel}; path=/`;
        }

        const correctSlug = Array.isArray(query.slug) ? query.slug.join('/') : query.slug || '';
        const preparedPathname = pathname
            .replace('[slug]', correctSlug)
            .replace('[...slug]', correctSlug)
            .replace('[code]', query.code as string);

        // Check if the current page is a Storyblok page
        const isStoryblok = await isStoryblokPage(correctSlug, locale);

        if (isStoryblok) {
            try {
                const alternative = await fetchStoryblokAlternative(correctSlug, locale, newLang);

                if (alternative) {
                    const channelPrefix =
                        channelAsLocale?.slug === DEFAULT_CHANNEL_SLUG ? '' : `${channelAsLocale?.slug || ''}/`;
                    const newPath = `/${channelPrefix}${alternative.full_slug}`;
                    // console.log('Redirecting to Storyblok alternative:', newPath);
                    push(newPath);
                    setIsOpen(false);
                    return;
                } else {
                    console.warn(
                        `No alternative found for Storyblok slug: ${correctSlug} in language: ${newLang}`
                    );
                }
            } catch (error) {
                console.error('Error fetching Storyblok alternative:', error);
            }
        }

        // Logic for non-Storyblok pages
        const buildPath = (path: string, localeValue: string) =>
            path.replace('[locale]', localeValue).replace('[channel]', channelAsLocale?.slug || '');

        if (sameAsChannel) {
            if (haveChannel && haveLocale) {
                const split = preparedPathname.split('[locale]');
                const correctPathname = buildPath(
                    split[0] + (newLang === channelAsLocale?.slug ? '' : newLang) + split[1],
                    newLang
                );
                // console.log(correctPathname);
                push(correctPathname);
            } else if (haveChannel && !haveLocale) {
                const split = preparedPathname.split('[channel]');
                const correctPathname = buildPath(
                    split[0] + (channelAsLocale?.nationalLocale || ''),
                    newLang
                ) + split[1];
                // console.log(correctPathname);
                push(correctPathname);
            } else if (!haveChannel && !haveLocale) {
                const _channel =
                    channelAsLocale?.channel === DEFAULT_CHANNEL
                        ? ''
                        : `${channelAsLocale?.nationalLocale || ''}/`;
                const _newLang = newLang === DEFAULT_LOCALE ? '' : newLang;
                const correctPathname = `/${_channel}${_newLang}${asPath}`;
                // console.log(correctPathname);
                push(correctPathname);
            }
        } else {
            if (haveChannel && haveLocale) {
                const split = preparedPathname.split('[locale]');
                const correctPathname = buildPath(split[0] + newLang + split[1], newLang);
                // console.log(correctPathname);
                push(correctPathname);
            } else if (haveChannel && !haveLocale) {
                const split = preparedPathname.split('[channel]');
                const correctPathname = buildPath(
                    split[0] + `${channelAsLocale?.nationalLocale}/${newLang}`,
                    newLang
                ) + split[1];
                // console.log(correctPathname);
                push(correctPathname);
            } else if (!haveChannel && !haveLocale) {
                const _channel =
                    channelAsLocale?.channel === DEFAULT_CHANNEL && newLang === DEFAULT_CHANNEL_SLUG
                        ? ''
                        : channelAsLocale?.nationalLocale;

                const correctPathname = `/${_channel}/${newLang}${asPath}`;
                // console.log('Redirecting:', correctPathname);
                push(correctPathname);
            }
        }
        setIsOpen(false);
    };


    return (
        <>
            <Stack itemsCenter gap={'5px'}>
                <CurrentLocale onClick={() => setIsOpen(true)}>
                    <SvgWrapper>
                        {getFlagByCode(locale, true)}
                    </SvgWrapper>
                </CurrentLocale>
                <svg width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.53212 2.42575L4.62826 0.193098C4.64861 0.171281 4.67286 0.154041 4.69957 0.1424C4.72627 0.130758 4.7549 0.124952 4.78375 0.125325C4.81261 0.125698 4.84109 0.132243 4.86753 0.144571C4.89397 0.1569 4.91782 0.174761 4.93766 0.197098C4.97833 0.242786 5.00068 0.303585 4.99998 0.366576C4.99928 0.429566 4.97558 0.489783 4.93391 0.534429L2.68276 2.93208C2.66256 2.95377 2.63851 2.97095 2.61202 2.98261C2.58552 2.99427 2.55711 3.00018 2.52845 3C2.49979 2.99981 2.47145 2.99353 2.44508 2.98153C2.41872 2.96952 2.39487 2.95203 2.37492 2.93008L0.0637635 0.40643C0.0228605 0.361252 0 0.300901 0 0.238098C0 0.175294 0.0228605 0.114944 0.0637635 0.0697655C0.083863 0.0476906 0.107911 0.0301417 0.134484 0.0181582C0.161057 0.00617463 0.189615 0 0.218466 0C0.247317 0 0.275874 0.00617463 0.302447 0.0181582C0.32902 0.0301417 0.353068 0.0476906 0.373168 0.0697655L2.53212 2.42575Z"
                        fill="black" />
                </svg>
            </Stack>
            {isOpen && (
                <Overlay>
                    <PickerWrapper ref={ref} column gap={'3rem'} justifyCenter>
                        <IconWrapper onClick={() => setIsOpen(false)}>
                            <XIcon />
                        </IconWrapper>
                        {changeModal?.modal ? (

                                <Header gap="2rem" column itemsCenter>
                                <TP>
                                    <Trans
                                        values={{ country: changeModal.country_name }}
                                        components={{ 1: <strong></strong> }}
                                        i18nKey="picker.detected"
                                        t={t}
                                    />
                                </TP>
                        </Header>
                        ) : null}

                        <StyledForm onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="locale"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Dropdown
                                        items={
                                            channels
                                                .find(c => c.nationalLocale === watch('channel'))
                                                ?.locales.map(l => {
                                                return {
                                                    key: l,
                                                    children: (
                                                        <LocaleInList itemsCenter gap="1rem">
                                                            {getFlagByCode(l)}
                                                        </LocaleInList>
                                                    ),
                                                };
                                            }) ?? []
                                        }
                                        placeholder={t('picker.change-language')}
                                        setSelected={onChange}
                                        selected={value}
                                        renderSelected={value => (
                                            <LocaleInList w100 gap="1rem" style={{ marginTop: '0.25rem' }}>
                                                {getFlagByCode(value)}
                                            </LocaleInList>
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name="channel"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Dropdown
                                        items={channels.map(c => {
                                            return {
                                                key: c.slug,
                                                children: (
                                                    <LocaleInList itemsCenter gap="1rem">
                                                        {getFlagByCode(c.nationalLocale)}
                                                    </LocaleInList>
                                                ),
                                            };
                                        })}
                                        placeholder={t('picker.ship-to-country')}
                                        setSelected={channel => {
                                            onChange(channel);
                                            if (channel === value) return;
                                            setValue(
                                                'locale',
                                                channels.find(c => c.nationalLocale === channel)
                                                    ?.nationalLocale as string,
                                            );
                                        }}
                                        selected={value}
                                        renderSelected={value => (
                                            <LocaleInList w100 gap="1rem" style={{ marginTop: '0.25rem' }}>
                                                {getFlagByCode(value)}
                                            </LocaleInList>
                                        )}
                                    />
                                )}
                            />
                            <Stack gap={'16px'}>
                                <WhiteStyledButton type="button" onClick={() => setIsOpen(false)}>
                                    {t('picker.cancel')}
                                </WhiteStyledButton>
                                <PrimaryStyledButton type="submit">{t('picker.save')}  &nbsp;<Check></Check></PrimaryStyledButton>
                            </Stack>
                        </StyledForm>
                    </PickerWrapper>
                </Overlay>
            )}
        </>
    );
};

const Header = styled(Stack)`
    max-width: 32rem;
    width: 100%;
`;

const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const LocaleInList = styled(Stack)`
    cursor: pointer;

    svg {
        width: 3rem;
        height: 2rem;
    }
`;

const CurrentLocale = styled.button`
    position: relative;
    width: 21px;
    height: 21px;
    border: none;
    border-radius: 50%;
    overflow: hidden; /* Ensures the circle shape */
    background-color: transparent;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;

    &:focus {
        outline: none;
    }

    /* Pseudo-element for the border */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid black;
        border-radius: 50%;
        pointer-events: none;
    }
`;

const SvgWrapper = styled.div`
    position: absolute; /* Allow positioning within the button */
    width: 150%; /* Scale to ensure it covers the circle */
    height: 120%;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Fill the wrapper */
    }
`;


const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.grayAlpha(800, 0.7)};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    backdrop-filter: blur(0.2rem);
    z-index: 100;
    padding: 0 2rem;
    z-index: 3000;
`;

const PickerWrapper = styled(Stack)`
    min-width: 480px;

    position: relative;
    padding: 66px;
    align-items: center;
    background-color: ${({ theme }) => theme.background.main};
`;

const IconWrapper = styled.div`
    position: absolute;
    top: 35px;
    right: 35px;
    cursor: pointer;
    
    
    svg {
        width: 17px;
        height: 17px;
        color: ${({ theme }) => theme.text.accent}
    }
`;

const WhiteStyledButton = styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 18px 30px;
    width: 100%;
    background-color: ${({ theme }) => theme.background.main};
    color: ${({ theme }) => theme.text.main};
    transition: all 0.2s ease-in-out;
    border: 1px solid #4D4D4D;
    border-radius: 12px;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        padding-block: 1.5rem;
    }
`;
const PrimaryStyledButton = styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 18px 30px;
    width: 100%;
    background-color: ${({ theme }) => theme.background.accentGreen};
    color: ${({ theme }) => theme.text.white};
    transition: all 0.2s ease-in-out;
    border: 1px solid #4D4D4D;
    border-radius: 12px;
    
    
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        padding-block: 1.5rem;
    }
`;
