import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import LPOForm from '@/pages/apps/purchase/lpo/LPOForm';
import { clearLocalPurchaseOrderState } from '@/store/slices/localPurchaseOrderSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Local_Purchase_Order);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { LPO, success, loading } = useAppSelector(state => state.localPurchaseOrder);

    useEffect(() => {
        dispatch(setPageTitle('New LPO'));
    }, []);

    useEffect(() => {
        if (LPO && success) {
            dispatch(clearLocalPurchaseOrderState());
            router.push('/apps/purchase/lpo');
        }
    }, [LPO, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Local_Purchase_Order}
                title="Create LPO"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/lpo'
                }}
            />
            <PageWrapper
                embedLoader={false}
                loading={false}
                breadCrumbItems={[]}
            >
                <LPOForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
