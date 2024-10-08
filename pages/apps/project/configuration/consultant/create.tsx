import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath} from '@/utils/enums';
import ConsultantForm from './ConsultantForm';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearConsultantState } from '@/store/slices/projects/consultantSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Consultant);
    const dispatch = useAppDispatch();
    const { consultant, success } = useAppSelector((state) => state.consultant);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new consultant'));
    }, []);

    useEffect(() => {
        if (consultant && success) {
            router.push(AppBasePath.Consultant);
            dispatch(clearConsultantState());
        }
    }, [consultant, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Consultant}
                title="Register Consultant"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: AppBasePath.Client
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <ConsultantForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
