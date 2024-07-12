import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import QuotationForm from "@/pages/erp/sale/quotation/QuotationForm";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {useRouter} from "next/router";
import {clearQuotationState} from "@/store/slices/quotationSlice";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const {quotation, success} = useAppSelector(state => state.quotation);
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
            title: 'All Quotations',
            href: '/erp/sale/quotation'
        },
        {
            title: 'Create Quotation',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Quotation'));
    }, []);

    useEffect(() => {
        if (quotation && success) {
            router.push('/erp/sale/quotation')
            dispatch(clearQuotationState());
        }
    }, [quotation, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
            title="Create Quotation"
            buttons={[
                {
                    text: 'Back',
                    icon: IconType.back,
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/sale/quotation'
                }
            ]}
        >
            <QuotationForm/>
        </PageWrapper>
    );
};

export default Create;
