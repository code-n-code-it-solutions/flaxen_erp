import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath } from '@/utils/enums';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearQuotationState } from '@/store/slices/quotationSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import QuotationForm from '@/pages/apps/sales/quotations/QuotationForm';

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
            router.push('/apps/sales/quotations');
        }
    }, [quotation, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Quotation}
                title="Create Quotation"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/quotations'
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
