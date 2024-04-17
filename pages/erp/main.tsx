import React from "react";
import PageWrapper from "@/components/PageWrapper";

const Main = () => {

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
        >
            <div className="flex justify-center flex-col items-center h-[calc(100vh-16rem)] gap-5">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to the Flaxen ERP</h1>
                    <p className="text-lg mt-4">This is the main page of the ERP</p>
                </div>
                <u className="list-decimal list-inside no-underline">
                    <li>The default selected menus are the dashboards of each module</li>
                    <li>Select Any Module from Left Top Corner</li>
                </u>
            </div>
        </PageWrapper>
    );
};

export default Main;
