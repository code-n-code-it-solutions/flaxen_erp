import React from 'react';
import AppLayout from '@/components/Layouts/AppLayout';

const AppContainer = ({ children }: { children: React.ReactElement }) => {
    return (
        children
    );
};

AppContainer.getLayout = (page: any) => {
    return <AppLayout>{page}</AppLayout>;
};
export default AppContainer;


