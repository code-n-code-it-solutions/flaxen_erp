import React from 'react';
import {useRouter} from "next/router";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const FormulaDetails = () => {
    const router = useRouter();
    console.log(router.query.id);
    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Home',
                    href: '/main',
                },
                {
                    title: 'All Product Assemblies',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Formula Detail - </h5>
                        <Link href="/inventory/product-assembly/create"
                              className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                     fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Add New
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormulaDetails;
