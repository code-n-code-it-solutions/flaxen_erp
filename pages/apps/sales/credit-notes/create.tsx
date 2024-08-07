import React, { useEffect } from 'react';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearCreditNoteState } from '@/store/slices/creditNoteSlice';
import CreditNoteForm from '@/pages/apps/sales/credit-notes/CreditNoteForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.Credit_Notes);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { creditNote, success } = useAppSelector(state => state.creditNote);

    useEffect(() => {
        dispatch(clearCreditNoteState());
        dispatch(setPageTitle('New Credit Note'));
    }, []);

    useEffect(() => {
        if (success && creditNote) {
            router.push('/apps/sales/credit-notes');
        }
    }, [success, creditNote]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Credit_Notes}
                title="Create Credit Note"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/credit-notes'
                }}
            />
            <PageWrapper>
                <CreditNoteForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) =><AppLayout>{page}</AppLayout>
export default Create;
