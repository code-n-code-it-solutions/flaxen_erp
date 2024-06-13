import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearGoodReceiveNoteState } from '@/store/slices/goodReceiveNoteSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath } from '@/utils/enums';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import GoodReceiveNoteForm from '@/pages/apps/purchase/grn/GoodReceiveNoteForm';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Good_Receive_Note);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { GRN, success, loading } = useAppSelector(state => state.goodReceiveNote);

    useEffect(() => {
        dispatch(setPageTitle('New Good Receive Note'));
    }, []);

    useEffect(() => {
        if (GRN && success) {
            dispatch(clearGoodReceiveNoteState());
            router.push('/apps/purchase/grn');
        }
    }, [GRN, success]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Good_Receive_Note}
                title="Create GRN"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/grn'
                }}
            />
            <PageWrapper
                loading={false}
                embedLoader={false}
                breadCrumbItems={[]}
            >
                <GoodReceiveNoteForm />
            </PageWrapper>
        </div>
    );
};
Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
