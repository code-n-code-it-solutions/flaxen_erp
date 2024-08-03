import React, { useEffect } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import InvoiceForm from '@/pages/apps/invoicing/customers/invoices/InvoiceForm';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearSaleInvoiceState } from '@/store/slices/saleInvoiceSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Invoice)
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {saleInvoice, success} = useAppSelector(state => state.saleInvoice);

    useEffect(() => {
        dispatch(clearSaleInvoiceState())
        dispatch(setPageTitle('New Invoice'));
    }, []);

    useEffect(() => {
        if(success && saleInvoice) {
            router.push('/apps/invoicing/customers/invoices');
        }
    }, [success, saleInvoice]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Invoice}
                title="Create Invoice"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/invoicing/customers/invoices'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <InvoiceForm />
            </PageWrapper>

        </div>
);
};

// Create.getLayout = (page: any) =><AppLayout>{page}</AppLayout>
export default Create;
