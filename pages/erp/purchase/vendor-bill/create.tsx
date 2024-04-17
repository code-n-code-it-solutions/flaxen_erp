import React, {useEffect} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearGoodReceiveNoteState} from "@/store/slices/goodReceiveNoteSlice";
import GoodReceiveNoteForm from "@/pages/erp/purchase/good-receive-note/GoodReceiveNoteForm";
import VendorBillForm from "@/pages/erp/purchase/vendor-bill/VendorBillForm";
import {clearVendorBillState} from "@/store/slices/vendorBillSlice";
import PageWrapper from '@/components/PageWrapper';

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {vendorBill, success, loading} = useSelector((state: IRootState) => state.vendorBill);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/purchase',
        },
        {
            title: 'Vendor Bills',
            href: '/purchase/vendor-bill',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];
    useEffect(() => {
        dispatch(setPageTitle( 'New Good Receive Note'));
    }, []);

    useEffect(() => {
        if(vendorBill && success) {
            dispatch(clearVendorBillState());
            router.push('/purchase/vendor-bill');
        }
    }, [vendorBill, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">
                    Enter Details of Good Receive Notes
                </h5>
                <Link href="/purchase/good-receive-note"
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
            <VendorBillForm/>
        </PageWrapper>
    );
};

export default Create;
