import React from 'react';
import SuperAdminLayout from '@/components/Layouts/SuperAdminLayout';

const Index = () => {
    return (
        <div>
            <h1>Super Admin</h1>
        </div>
    );
};

Index.getLayout = (page: any) => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Index;
