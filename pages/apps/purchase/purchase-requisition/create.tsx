import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState} from "@/store/slices/purchaseRequisitionSlice";
import PurchaseRequestForm from "@/pages/erp/purchase/purchase-requisition/PurchaseRequestForm";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {purchaseRequest, statuses, success, loading} = useAppSelector(state => state.purchaseRequisition);

    useEffect(() => {
        dispatch(setPageTitle( 'New PR'));
    }, []);

    useEffect(() => {
        if(purchaseRequest && success) {
            dispatch(clearPurchaseRequisitionState());
            router.push('/apps/purchase/purchase-requisition');
        }
    }, [purchaseRequest, success]);

    return (
        <PageWrapper
            title={'Create New Purchase Requisition'}
            embedLoader={false}
            loading={false}
            breadCrumbItems={[]}
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/purchase/purchase-requisition'
                }
            ]}
        >
            <PurchaseRequestForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
