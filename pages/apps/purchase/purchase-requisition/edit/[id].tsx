import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState, editPurchaseRequisition} from "@/store/slices/purchaseRequisitionSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import AppLayout from '@/components/Layouts/AppLayout';
import PurchaseRequestForm from '@/pages/apps/purchase/purchase-requisition/PurchaseRequestForm';

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {purchaseRequest, statuses, success, loading} = useAppSelector(state => state.purchaseRequisition);

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
            router.push('/apps/purchase/purchase-requisition');
        }
    }, [purchaseRequest, success]);

    return (
        <PageWrapper
            title={'Edit Purchase Requisition'}
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
            <PurchaseRequestForm id={router.query.id}/>
        </PageWrapper>
    );
};

// Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
