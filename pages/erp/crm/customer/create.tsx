import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";
import Button from "@/components/Button";
import CustomerForm from './CustomerForm';
import { clearCustomerState } from '@/store/slices/customerSlice';

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
            href: '/crm/customer',
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
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Customers</h5>
                    <Button
                        text={<span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>}
                        type={ButtonType.link}
                        variant={ButtonVariant.primary}
                        link="/crm/customer"
                        size={ButtonSize.small}
                    />
                </div>
                <CustomerForm />
            </div>
        </PageWrapper>
    );
};

export default Create;
