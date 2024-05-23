import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";
import CustomerForm from './CustomerForm';
import {clearCustomerState} from '@/store/slices/customerSlice';
import {getIcon} from "@/utils/helper";
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
    const dispatch = useAppDispatch();
    const {customer, success} = useAppSelector((state) => state.customer);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new Customer'));
    }, []);

    useEffect(() => {
        if (customer && success) {
          router.push('/apps/sales/configuration/customers')
          dispatch(clearCustomerState())
        }
      }, [customer, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            title="Create Customer"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/sales/configuration/customers'
                }
            ]}
        >
            <CustomerForm />
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
