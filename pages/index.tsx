import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const Index = () => {
    return (
        <div>
            Website
        </div>
    );
};

Index.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Index;
