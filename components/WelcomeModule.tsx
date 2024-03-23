import React from 'react';
import PageWrapper from "@/components/PageWrapper";

const WelcomeModule = ({title}: {title:string}) => {
    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
        >
            <div className="flex justify-center flex-col items-center h-[calc(100vh-16rem)] gap-5">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to the {title}</h1>
                    <p className="text-lg mt-4">This is the {title} Module of the ERP</p>
                </div>
            </div>
        </PageWrapper>
    );
};

export default WelcomeModule;
