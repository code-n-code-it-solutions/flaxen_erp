import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState} from "@/store/slices/productionSlice";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import ProductionForm from "@/pages/erp/inventory/productions/ProductionForm";
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {production, success} = useAppSelector(state => state.production);

    useEffect(() => {
        dispatch(setPageTitle('Create Productions'));
    }, []);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/apps/manufacturing/operations/production');
        }
    }, [production, success]);


    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={true}
            loading={false}
            title="Create Productions"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/operations/production'
                }
            ]}
        >
            <ProductionForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
