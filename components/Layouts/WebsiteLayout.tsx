import {PropsWithChildren, useEffect} from 'react';
import App from '../../App';
import Header from "@/components/Layouts/website/Header";

const WebsiteLayout = ({children}: PropsWithChildren) => {
    return (
        <App>
            <div className="min-h-screen text-black dark:text-white-dark">
                {/*<Header />*/}
                {children}
            </div>
        </App>
    );
};

export default WebsiteLayout;
