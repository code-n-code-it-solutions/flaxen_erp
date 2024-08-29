import React, { useEffect } from 'react';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearCreditNoteState } from '@/store/slices/creditNoteSlice';
import ReceiptVoucherForm from '@/pages/apps/accounting/general-voucher/receipt-voucher/ReceiptVoucherForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.General_Receipt_Voucher);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { generalReceiptVoucher, success } = useAppSelector(state => state.generalReceiptVoucher);

    useEffect(() => {
        dispatch(clearCreditNoteState());
        dispatch(setPageTitle('New GRV'));
    }, []);

    useEffect(() => {
        if (success && generalReceiptVoucher) {
            router.push('/apps/accounting/general-voucher/receipt-voucher');
        }
    }, [success, generalReceiptVoucher]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.General_Receipt_Voucher}
                title="Create General Receipt Voucher"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/accounting/general-voucher/receipt-voucher'
                }}
            />
            <PageWrapper>
                <ReceiptVoucherForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) =><AppLayout>{page}</AppLayout>
export default Create;
