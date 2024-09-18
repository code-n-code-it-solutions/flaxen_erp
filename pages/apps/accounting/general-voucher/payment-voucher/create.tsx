import React, { useEffect } from 'react';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import PaymentVoucherForm from '@/pages/apps/accounting/general-voucher/payment-voucher/PaymentVoucherForm';
import { clearGeneralPaymentVoucherState } from '@/store/slices/generalPaymentVoucherSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.General_Payment_Voucher);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { generalPaymentVoucher, success } = useAppSelector(state => state.generalPaymentVoucher);

    useEffect(() => {
        dispatch(clearGeneralPaymentVoucherState());
        dispatch(setPageTitle('New GPV'));
    }, []);

    useEffect(() => {
        if (success && generalPaymentVoucher) {
            router.push('/apps/accounting/general-voucher/payment-voucher');
        }
    }, [success, generalPaymentVoucher]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.General_Payment_Voucher}
                title="Create General Payment Voucher"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/accounting/general-voucher/payment-voucher'
                }}
            />
            <PageWrapper>
                <PaymentVoucherForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) =><AppLayout>{page}</AppLayout>
export default Create;
