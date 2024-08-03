import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import ProductForm from '@/pages/apps/inventory/products/ProductForm';
import { clearRawProductState } from '@/store/slices/rawProductSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import QuotationForm from '@/pages/apps/sales/orders/quotations/QuotationForm';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearQuotationState } from '@/store/slices/quotationSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Quotation);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { quotation, success } = useAppSelector(state => state.quotation);

    useEffect(() => {
        dispatch(setPageTitle('New Quotation'));
    }, []);

    useEffect(() => {
        if (quotation && success) {
            dispatch(clearQuotationState());
            router.push('/apps/sales/orders/quotations');
        }
    }, [quotation, success]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Quotation}
                title="Create Quotation"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/orders/quotations'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <QuotationForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
