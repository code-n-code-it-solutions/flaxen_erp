import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import SaleInvoiceForm from "@/pages/erp/sale/sale-invoice/SaleInvoiceForm";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const breadcrumb = [
        {
            title: 'Home',
            href: '/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/sale'
        },
        {
            title: 'All Sale Invoices',
            href: '/sale/sale-invoice'
        },
        {
            title: 'Create Sale Invoice',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Sale Invoice'));
    }, []);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Create Sale Invoice</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.back)}
                            Back
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link={'/sale/sale-invoice'}
                    size={ButtonSize.small}
                />
            </div>
            <SaleInvoiceForm/>
        </PageWrapper>
    );
};

export default Create;
