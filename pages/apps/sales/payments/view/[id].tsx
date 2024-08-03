import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import { useRouter } from 'next/router';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken } from '@/configs/api.config';
import { showDetails, clearCustomerPaymentState } from '@/store/slices/customerPayment';
import PageWrapper from '@/components/PageWrapper';

const View = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment)
    const router = useRouter()
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {customerPaymentDetail, loading} = useAppSelector(state => state.customerPayment);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Payment Details'));
        dispatch(clearCustomerPaymentState());
        const paymentId = router.query.id;

        if (paymentId) {
            setIds(Array.isArray(paymentId) ? paymentId : [paymentId]);
            const id = Array.isArray(paymentId) ? paymentId[0] : paymentId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);


    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Invoice}
                title="Customer Payment Detail"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/invoicing/customers/invoices/print/' + ids.join('/'))
                    },
                    delete: {
                        show: false
                    },
                    duplicate: {
                        show: true,
                        onClick: () => console.log('duplicate')
                    },
                    email: {
                        show: true,
                        onClick: () => console.log('email')
                    }
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/invoicing/customers/invoices'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                <div></div>
            </PageWrapper>

        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
