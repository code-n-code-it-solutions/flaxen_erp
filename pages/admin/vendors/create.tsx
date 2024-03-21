import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import VendorForm from "@/pages/admin/vendors/VendorForm";
import {clearVendorState} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {vendor, loading} = useSelector((state: IRootState) => state.vendor);
    const breadcrumb = [
        {
            title: 'Main Dashboard',
            href: '/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/admin',
        },
        {
            title: 'All Vendors',
            href: '/admin/vendors',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Vendor'));
    }, []);

    // useEffect(() => {
    //     if (vendor) {
    //         dispatch(clearVendorState());
    //         router.push('/admin/vendors');
    //     }
    // }, [vendor]);

    return (
        <PageWrapper
            loading={false}
            embedLoader={false}
            breadCrumbItems={breadcrumb}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Vendors</h5>
                    <Button
                        type={ButtonType.link}
                        text={
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                     height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back
                            </span>
                        }
                        variant={ButtonVariant.primary}
                        link='/admin/vendors'
                        size={ButtonSize.small}
                    />
                </div>
                <VendorForm/>
            </div>
        </PageWrapper>
    );
};

export default Create;
