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

const Create = () => {
    const dispatch = useAppDispatch();
    const {customer, success} = useAppSelector((state) => state.customer);
    const router = useRouter();
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'CRM dashboard',
            href: '/erp/crm',
        },
        {
            title: 'All customers',
            href: '/erp/crm/customer',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];
    useEffect(() => {
        dispatch(setPageTitle('Create new Customer'));
    }, []);

    useEffect(() => {
        if (customer && success) {
          router.push('/erp/crm/customer')
          dispatch(clearCustomerState())
        }
      }, [customer, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
            title="Create Customer"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/crm/customer'
                }
            ]}
        >
            <CustomerForm />
        </PageWrapper>
    );
};

export default Create;
