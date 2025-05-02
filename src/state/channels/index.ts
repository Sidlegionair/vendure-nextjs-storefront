import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { ChannelsContainerType, ChannelState } from './types';
import { channelsEmptyState } from './utils';

function useChannelsHook(
    initialState?: ChannelState
): ChannelsContainerType {

    // active channel slug
    const [channel, setChannel] = useState(
        initialState?.channel ?? channelsEmptyState.channel
    );

    // current locale
    const [locale, setLocale] = useState(
        initialState?.locale ?? channelsEmptyState.locale
    );

    return {
        channel,
        setChannel,
        locale,
        setLocale,
    };
}

// create and export container
const ChannelsContainer = createContainer(useChannelsHook);

export const ChannelsProvider = ChannelsContainer.Provider;
export const useChannels = ChannelsContainer.useContainer;
