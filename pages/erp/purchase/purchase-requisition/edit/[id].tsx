import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState, editPurchaseRequisition} from "@/store/slices/purchaseRequisitionSlice";
import PurchaseRequestForm from "@/pages/erp/purchase/purchase-requisition/PurchaseRequestForm";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {purchaseRequest, statuses, success, loading} = useAppSelector(state => state.purchaseRequisition);

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'All Purchase Requisitions',
            href: '/erp/purchase/purchase-requisition',
        },
        {
            title: 'Update',
            href: '#',
        },
    ]

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
            router.push('/erp/purchase/purchase-requisition');
        }
    }, [purchaseRequest, success]);

    return (
        <PageWrapper
            title={'Edit Purchase Requisition'}
            embedLoader={false}
            loading={false}
            breadCrumbItems={breadcrumbItems}
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/purchase/purchase-requisition'
                }
            ]}
        >
            <PurchaseRequestForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
