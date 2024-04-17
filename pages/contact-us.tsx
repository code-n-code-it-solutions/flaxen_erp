import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const ContactUs = () => {
    return (
        <div>
            Contact us
        </div>
    );
};

ContactUs.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default ContactUs;
