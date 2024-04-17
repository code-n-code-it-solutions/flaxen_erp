import React from 'react';
import WebsiteLayout from "@/components/Layouts/WebsiteLayout";

const Products = () => {
    return (
        <div>
            Products
        </div>
    );
};

Products.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Products;
