import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const Catalog = () => {
    return (
        <div>
            Catalog
        </div>
    );
};

Catalog.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Catalog;
