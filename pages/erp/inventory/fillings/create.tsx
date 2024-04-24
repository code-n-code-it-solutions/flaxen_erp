import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {clearFillingState} from "@/store/slices/fillingSlice";
import FillingForm from "@/pages/erp/inventory/fillings/FillingForm";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {filling, success, loading} = useAppSelector(state => state.filling);

    const breadCrumbItems = [
        {title: 'Home', href: '/erp/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Fillings', href: '/erp/inventory/fillings'},
        {title: 'Create New', href: '#'},
    ];

    useEffect(() => {
        dispatch(clearFillingState())
        dispatch(setPageTitle('Create Productions'));
    }, []);

    useEffect(() => {
        if (filling && success) {
            dispatch(clearFillingState());
            router.push('/erp/inventory/fillings');
        }
    }, [filling, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={loading}
            title="Create Filling"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/fillings'
                }
            ]}
        >
            <FillingForm/>
        </PageWrapper>
    );
};

export default Create;
