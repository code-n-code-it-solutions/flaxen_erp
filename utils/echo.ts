// import { axios } from '@/lib/axios'
import Echo from 'laravel-echo'
//
// import Pusher from 'pusher-js'
// window.Pusher = Pusher
//
const echo = new Echo({
//     broadcaster: 'reverb',
//     key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
//     authorizer: (channel:any) => {
//         return {
//             authorize: (socketId:any, callback:any) => {
//                 axios
//                     .post('/api/broadcasting/auth', {
//                         socket_id: socketId,
//                         channel_name: channel.name,
//                     })
//                     .then((response:any) => {
//                         callback(false, response.data)
//                     })
//                     .catch((error:any) => {
//                         callback(true, error)
//                     })
//             },
//         }
//     },
//     wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
//     wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
//     wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
//     forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
})
//
export default echo
