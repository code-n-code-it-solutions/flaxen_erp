import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import SaleInvoiceForm from "@/pages/erp/sale/sale-invoice/SaleInvoiceForm";
import {useRouter} from "next/router";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter()
    const {saleInvoice, success} = useAppSelector((state) => state.saleInvoice)
    const breadcrumb = [
        {
            title: 'Home',
            href: '/erp/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/erp/sale'
        },
        {
            title: 'All Sale Invoices',
            href: '/erp/sale/sale-invoice'
        },
        {
            title: 'Create Sale Invoice',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Sale Invoice'));
    }, []);

    useEffect(() => {
        if (saleInvoice && success) {
            router.push('/erp/sale/sale-invoice')
        }
    }, [saleInvoice, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
            title="Create Sale Invoice"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/sale/sale-invoice',
                    icon: IconType.back
                }

            ]}
        >
            <SaleInvoiceForm/>
        </PageWrapper>
    );
};

export default Create;
