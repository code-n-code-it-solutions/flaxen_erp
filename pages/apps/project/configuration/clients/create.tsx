import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath} from '@/utils/enums';
import ClientForm from './ClientForm';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearClientState } from '@/store/slices/projects/clientSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Client);
    const dispatch = useAppDispatch();
    const { client, success } = useAppSelector((state) => state.client);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new client'));
    }, []);

    useEffect(() => {
        if (client && success) {
            router.push(AppBasePath.Client);
            dispatch(clearClientState());
        }
    }, [client, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Client}
                title="Register Client"
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
                <ClientForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
