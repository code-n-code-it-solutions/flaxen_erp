import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState} from "@/store/slices/purchaseRequisitionSlice";
import PurchaseRequestForm from "@/pages/apps/purchase/purchase-requisition/PurchaseRequestForm";
import PageWrapper from "@/components/PageWrapper";
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Purchase_Requisition);
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
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Purchase_Requisition}
                title="Create PR"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/purchase-requisition'
                }}
            />
            <PageWrapper
                embedLoader={false}
                loading={false}
            >
                <PurchaseRequestForm/>
            </PageWrapper>
        </div>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
