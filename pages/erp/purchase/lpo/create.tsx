import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import LPOForm from "@/pages/erp/purchase/lpo/LPOForm";
import {clearLocalPurchaseOrderState} from "@/store/slices/localPurchaseOrderSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {LPO, success, loading} = useAppSelector(state => state.localPurchaseOrder);

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
            title: 'All LPOs',
            href: '/erp/purchase/lpo',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle( 'New LPO'));
    }, []);

    useEffect(() => {
        if(LPO && success) {
            dispatch(clearLocalPurchaseOrderState());
            router.push('/erp/purchase/lpo');
        }
    }, [LPO, success]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title={'New LPO'}
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/purchase/lpo'
                }
            ]}
        >
            <LPOForm/>
        </PageWrapper>
    );
};

export default Create;
