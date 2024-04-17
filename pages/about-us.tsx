import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const AboutUs = () => {
    return (
        <div>
            Contact us
        </div>
    );
};

AboutUs.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default AboutUs;
