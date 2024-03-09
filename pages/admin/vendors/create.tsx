import React, {useEffect, useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import VendorForm from "@/pages/admin/vendors/VendorForm";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {rawProduct} = useSelector((state: IRootState) => state.rawProduct);

    useEffect(() => {
        dispatch(setPageTitle( 'Create Vendor'));
    }, []);

    useEffect(() => {
        if(rawProduct) {
            dispatch(clearRawProductState());
            router.push('/admin/vendors');
        }
    }, [rawProduct]);

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Main Dashboard',
                    href: '/main',
                },
                {
                    title: 'Admin Dashboard',
                    href: '/admin',
                },
                {
                    title: 'Al Vendors',
                    href: '/admin/vendors',
                },
                {
                    title: 'Create New',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Vendors</h5>
                        <Link href="/admin/vendors"
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
                    <VendorForm/>
                </div>
            </div>
        </div>
    );
};

export default Create;
