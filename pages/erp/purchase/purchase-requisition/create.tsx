import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState} from "@/store/slices/purchaseRequisitionSlice";
import PurchaseRequestForm from "@/pages/erp/purchase/purchase-requisition/PurchaseRequestForm";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
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
            title: 'Create New',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle( 'New Purchase Requisition'));
    }, []);

    useEffect(() => {
        if(purchaseRequest && success) {
            dispatch(clearPurchaseRequisitionState());
            router.push('/erp/purchase/purchase-requisition');
        }
    }, [purchaseRequest, success]);

    return (
        <PageWrapper
            title={'Create New Purchase Requisition'}
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
            <PurchaseRequestForm/>
        </PageWrapper>
    );
};

export default Create;
