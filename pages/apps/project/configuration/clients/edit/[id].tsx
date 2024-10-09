import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearCustomerState } from '@/store/slices/customerSlice';
import PageWrapper from '@/components/PageWrapper';
import Button from '@/components/Button';
import { getIcon } from '@/utils/helper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { showDetails } from '@/store/slices/customerSlice';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import CustomerForm from '@/pages/apps/sales/configuration/customers/CustomerForm';
import { clearClientState } from '@/store/slices/projects/clientSlice';

const Edit = () => {
    const dispatch = useAppDispatch();
    const { client, success } = useAppSelector((state) => state.client);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Edit Customer'));
        const customerId = router.query.id;

        if (customerId) {
            const id = Array.isArray(customerId) ? customerId[0] : customerId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (client && success) {
            dispatch(clearClientState());
            router.push(AppBasePath.Client);
        }
    }, [client, success]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Client}
                title="Edit Client"
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
                <CustomerForm id={router.query.id} />
            </PageWrapper>
        </div>
    );
};

export default Edit;
