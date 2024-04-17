import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const Careers = () => {
    return (
        <div>
            Careers
        </div>
    );
};

Careers.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Careers;
