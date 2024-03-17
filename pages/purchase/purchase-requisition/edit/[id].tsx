import React, {useEffect, useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState, editPurchaseRequisition} from "@/store/slices/purchaseRequisitionSlice";
import PurchaseRequestForm from "@/pages/purchase/purchase-requisition/PurchaseRequestForm";

const Edit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {purchaseRequest, statuses, success, loading} = useSelector((state: IRootState) => state.purchaseRequisition);

    useEffect(() => {
        dispatch(setPageTitle( 'Edit Purchase Requisition'));
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editPurchaseRequisition(parseInt(id)))
        }
    }, [router.query]);

    useEffect(() => {
        if(purchaseRequest && success) {
            dispatch(clearPurchaseRequisitionState());
            router.push('/purchase/purchase-requisition');
        }
    }, [purchaseRequest, success]);

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Main Dashboard',
                    href: '/main',
                },
                {
                    title: 'Purchase Dashboard',
                    href: '/purchase',
                },
                {
                    title: 'All Purchase Requisitions',
                    href: '/purchase/purchase-requisition',
                },
                {
                    title: 'Create New',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Enter Details of Purchase Requisition
                        </h5>
                        <Link href="/purchase/purchase-requisition"
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
                    <PurchaseRequestForm id={router.query.id}/>
                </div>
            </div>
        </div>
    );
};

export default Edit;
