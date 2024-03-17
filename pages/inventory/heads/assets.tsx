import React from 'react';
import PageWrapper from "@/components/PageWrapper";

const Assets = () => {
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Product Assemblies',
            href: '#',
        },
    ];
    return (
        <PageWrapper
            embedLoader={false}
            loading={false}
            breadCrumbItems={breadCrumbItems}
        >

        </PageWrapper>
    );
};

export default Assets;
