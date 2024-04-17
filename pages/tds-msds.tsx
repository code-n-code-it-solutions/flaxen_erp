import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const TdsMsds = () => {
    return (
        <div>
            TDS & MSDS
        </div>
    );
};

TdsMsds.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default TdsMsds;
