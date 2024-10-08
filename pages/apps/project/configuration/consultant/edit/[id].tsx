import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { showDetails } from '@/store/slices/customerSlice';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearClientState } from '@/store/slices/projects/clientSlice';
import ConsultantForm from '@/pages/apps/project/configuration/consultant/ConsultantForm';

const Edit = () => {
    const dispatch = useAppDispatch();
    const { client, success } = useAppSelector((state) => state.client);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Edit Consultant'));
        const customerId = router.query.id;

        if (customerId) {
            const id = Array.isArray(customerId) ? customerId[0] : customerId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (client && success) {
            dispatch(clearClientState());
            router.push(AppBasePath.Consultant);
        }
    }, [client, success]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Consultant}
                title="Edit Client"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: AppBasePath.Consultant
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <ConsultantForm id={router.query.id} />
            </PageWrapper>
        </div>
    );
};

export default Edit;
