// src/state/channels/utils.ts
import { ChannelsContainerType } from './types';

export const channelsEmptyState: ChannelsContainerType = {
    channel: 'en',
    locale: 'en',
    setChannel: () => {},
    setLocale: () => {},
};
