import { useState, useEffect } from 'react';

const useOS = () => {
    const [os, setOS] = useState<string>('');

    useEffect(() => {
        const getOS = () => {
            if (navigator.userAgentData) {
                const platform = navigator.userAgentData.platform.toLowerCase();
                if (platform.includes('mac')) {
                    return 'mac';
                }
                if (platform.includes('win')) {
                    return 'windows';
                }
                if (platform.includes('linux')) {
                    return 'linux';
                }
            } else {
                const userAgent = navigator.userAgent.toLowerCase();
                if (userAgent.includes('mac')) {
                    return 'mac';
                }
                if (userAgent.includes('win')) {
                    return 'windows';
                }
                if (userAgent.includes('linux')) {
                    return 'linux';
                }
            }
            return 'unknown';
        };

        setOS(getOS());
    }, []);

    return os;
};

export default useOS;
