import React, { useEffect } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearCustomerPaymentState } from '@/store/slices/customerPayment';
import PaymentForm from '@/pages/apps/sales/payments/PaymentForm';
import { clearSaleInvoiceListState } from '@/store/slices/saleInvoiceSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment)
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {customerPayment, success} = useAppSelector(state => state.customerPayment);

    useEffect(() => {
        dispatch(setPageTitle('New Payment'));
        dispatch(clearCustomerPaymentState());
        dispatch(clearSaleInvoiceListState())
    }, []);

    useEffect(() => {
        if(success && customerPayment) {
            router.push('/apps/sales/payments');
        }
    }, [success, customerPayment]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Invoice_Payment}
                title="New Customer Payment"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/payments'
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
