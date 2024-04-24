import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState} from "@/store/slices/productionSlice";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";
import PageWrapper from "@/components/PageWrapper";
import {getIcon} from "@/utils/helper";
import ProductionForm from "@/pages/erp/inventory/productions/ProductionForm";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {production, success} = useAppSelector(state => state.production);

    const breadCrumbItems = [
        {title: 'Home', href: '/erp/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Productions', href: '/erp/inventory/productions'},
        {title: 'Create New', href: '#'},
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Productions'));
    }, []);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/erp/inventory/productions');
        }
    }, [production, success]);


    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={false}
            title="Create Productions"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/productions'
                }
            ]}
        >
            <ProductionForm/>
        </PageWrapper>
    );
};

export default Create;
