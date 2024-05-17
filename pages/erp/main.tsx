import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";
import Link from "next/link";

const Main = () => {

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
            panel={false}
        >
            <div className="container">
                <div className="grid grid-cols-4 gap-4 md:grid-cols-8 justify-center items-center">
                    <Link href={''}>
                        <div
                            className="flex flex-col justify-center items-center gap-2 bg-white bg-opacity-70 py-4 rounded-md border shadow-md">
                            {/*<div className="flex justify-center items-center bg-blue-500 text-white w-16 h-16 rounded-full">*/}
                            {/*    <span className="text-2xl font-bold">1</span>*/}
                            {/*</div>*/}
                            <div className="flex justify-center items-center p-2">
                                <Image src="/assets/images/default.jpeg" alt="ERP" width={50} height={50}/>
                            </div>
                            <span>Module 1</span>
                        </div>
                    </Link>
                </div>
            </div>
            {/*<div className="flex justify-center flex-col items-center h-[calc(100vh-16rem)] gap-5">*/}
            {/*    <div className="text-center">*/}
            {/*        <h1 className="text-4xl font-bold">Welcome to the Flaxen ERP</h1>*/}
            {/*        <p className="text-lg mt-4">This is the main page of the ERP</p>*/}
            {/*    </div>*/}
            {/*    <u className="list-decimal list-inside no-underline">*/}
            {/*        <li>The default selected menus are the dashboards of each module</li>*/}
            {/*        <li>Select Any Module from Left Top Corner</li>*/}
            {/*    </u>*/}
            {/*</div>*/}
        </PageWrapper>
    );
};

export default Main;
