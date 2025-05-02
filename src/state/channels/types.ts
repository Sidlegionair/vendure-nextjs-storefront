// src/state/channels/types.ts

export type ChannelState = {
    channel: string;
    locale: string;
};

export type ChannelsContainerType = {
    channel: string;
    locale: string;
    setChannel: (channel: string) => void;
    setLocale: (locale: string) => void;
};
