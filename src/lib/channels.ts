// export const DEFAULT_CHANNEL = 'gx9ktntebrqot7t8ua';
export const DEFAULT_CHANNEL = process.env.DEFAULT_CHANNEL_SLUG || 'default-channel';

export const DEFAULT_CHANNEL_SLUG = 'en';

export const DEFAULT_LOCALE = 'en';
export const DEFAULT_NATIONAL_LOCALE = 'en';

export async function fetchChannels() {
    // Replace CHANNELS_ENDPOINT with your actual endpoint URL,
    // e.g. process.env.CHANNELS_ENDPOINT might be "https://api.example.com/channels"
    const res = await fetch(process.env.NEXT_PUBLIC_HOST+'/channels' as string);
    if (!res.ok) {
        throw new Error(`Failed to fetch channels: ${res.statusText}`);
    }
    return res.json(); // expecting an array of channel objects
}
