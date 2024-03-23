import {PropsWithChildren, useEffect} from 'react';
import App from '../../App';

const WebsiteLayout = ({children}: PropsWithChildren) => {
    return (
        <App>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </App>
    );
};

export default WebsiteLayout;
