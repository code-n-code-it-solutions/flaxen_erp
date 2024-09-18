import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: Echo;
        Pusher: Pusher;
    }
}

// @ts-ignore
window.Pusher = Pusher;

export const privateLaraEcho = (token:string) => new Echo({
    broadcaster: 'reverb',
    encrypted: false,
    authEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL+'/'+process.env.NEXT_PUBLIC_REVERB_AUTH_ENDPOINT,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

export const publicLaraEcho = new Echo({
    broadcaster: 'reverb',
    encrypted: false,
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
