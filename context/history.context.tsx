import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface HistoryContextType {
    history: string[];
    setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            setHistory((prevHistory) => {
                if (prevHistory[prevHistory.length - 1] !== url) {
                    return [...prevHistory, url];
                }
                return prevHistory;
            });
        };

        // Add the initial route to the history
        setHistory([router.pathname]);

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events, router.pathname]);

    return (
        <HistoryContext.Provider value={{ history, setHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = (): HistoryContextType => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
