import React from 'react';
import AppLayout from '@/components/Layouts/AppLayout';

const Index = () => {
    return (
        <div>Accounting dashboard</div>
    );
};


Index.getLayout = (page: any) => {
    return <AppLayout>{page}</AppLayout>;
};
export default Index;
