import React, {useEffect} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import EmployeeForm from "@/pages/erp/hr/employee/EmployeeForm";
import PageWrapper from "@/components/PageWrapper";
import {clearEmployeeState} from "@/store/slices/employeeSlice";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {rawProduct, loading, success} = useSelector((state: IRootState) => state.rawProduct);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'HR Dashboard',
            href: '/hr',
        },
        {
            title: 'All Employees',
            href: '/hr/employee',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('New Employee'));
    }, []);

    useEffect(() => {
        if (rawProduct && success) {
            dispatch(clearEmployeeState());
            router.push('/hr/employee');
        }
    }, [rawProduct, success]);

    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadCrumbItems}
            loading={loading}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Enter Details of Employees
                    </h5>
                    <Link href="/hr/employee"
                          className="btn btn-primary btn-sm m-1">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>
                    </Link>
                </div>
                <EmployeeForm/>
            </div>
        </PageWrapper>
    );
};

export default Create;
