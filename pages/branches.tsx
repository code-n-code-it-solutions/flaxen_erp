import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const Branches = () => {
    return (
        <div>
            Branches
        </div>
    );
};

Branches.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Branches;
