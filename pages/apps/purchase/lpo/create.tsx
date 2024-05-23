import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import LPOForm from '@/pages/erp/purchase/lpo/LPOForm';
import { clearLocalPurchaseOrderState } from '@/store/slices/localPurchaseOrderSlice';
import PageWrapper from '@/components/PageWrapper';
import { ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
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
        <PageWrapper
            embedLoader={false}
            loading={false}
            breadCrumbItems={[]}
            title={'New LPO'}
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/purchase/lpo'
                }
            ]}
        >
            <LPOForm />
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
