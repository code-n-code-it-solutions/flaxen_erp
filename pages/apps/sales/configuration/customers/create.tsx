import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import Button from '@/components/Button';
import CustomerForm from './CustomerForm';
import { clearCustomerState } from '@/store/slices/customerSlice';
import { getIcon } from '@/utils/helper';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const Create = () => {
    useSetActiveMenu(AppBasePath.Customer);
    const dispatch = useAppDispatch();
    const { customer, success } = useAppSelector((state) => state.customer);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new Customer'));
    }, []);

    useEffect(() => {
        if (customer && success) {
            router.push('/apps/sales/configuration/customers');
            dispatch(clearCustomerState());
        }
    }, [customer, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Customer}
                title="Register Customer"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/configuration/customers'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <CustomerForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
