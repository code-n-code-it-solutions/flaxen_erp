import React, { useEffect } from 'react';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import CreditNoteForm from '@/pages/apps/sales/credit-notes/CreditNoteForm';
import { clearDebitNoteState } from '@/store/slices/debitNoteSlice';
import DebitNoteForm from '@/pages/apps/purchase/debit-notes/DebitNoteForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.Debit_Notes);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { debitNote, success } = useAppSelector(state => state.debitNote);

    useEffect(() => {
        dispatch(clearDebitNoteState());
        dispatch(setPageTitle('New Debit Note'));
    }, []);

    useEffect(() => {
        if (success && debitNote) {
            router.push('/apps/purchase/debit-notes');
        }
    }, [success, debitNote]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Debit_Notes}
                title="Create Debit Note"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/debit-notes'
                }}
            />
            <PageWrapper>
                <DebitNoteForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) =><AppLayout>{page}</AppLayout>
export default Create;
