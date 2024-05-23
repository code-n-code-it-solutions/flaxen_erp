import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearCustomerState} from "@/store/slices/customerSlice";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {getIcon} from "@/utils/helper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import CustomerForm from "@/pages/erp/crm/customer/CustomerForm";
import {showDetails} from "@/store/slices/customerSlice";
import AppLayout from '@/components/Layouts/AppLayout';

const Edit = () => {
    const dispatch = useAppDispatch();
    const {customer, success} = useAppSelector((state) => state.customer);
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
        if (customer && success) {
            router.push('/apps/sales/configuration/customers')
            dispatch(clearCustomerState())
        }
    }, [customer, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            title="Edit Customer"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/apps/sales/configuration/customers/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/sales/configuration/customers'
                }
            ]}
        >
            <CustomerForm id={router.query.id}/>
        </PageWrapper>
    );
};

Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
