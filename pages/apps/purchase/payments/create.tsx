import React, { useEffect } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import PaymentForm from '@/pages/apps/purchase/payments/PaymentForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.Vendor_Payment);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { vendorPayment, success } = useAppSelector(state => state.vendorPayment);

    useEffect(() => {
        dispatch(setPageTitle('New Payment'));
    }, []);

    useEffect(() => {
        if (success && vendorPayment) {
            router.push('/apps/purchase/payments');
        }
    }, [success, vendorPayment]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor_Payment}
                title="Vendor Payment"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/payments'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <PaymentForm />
            </PageWrapper>

        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
