import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/apps/inventory/products/ProductForm";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {rawProduct} = useAppSelector(state => state.rawProduct);

    useEffect(() => {
        dispatch(setPageTitle('New'));
    }, []);

    useEffect(() => {
        if (rawProduct) {
            dispatch(clearRawProductState());
            router.push('/apps/inventory/products');
        }
    }, [rawProduct]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            title="Create Raw Material"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/products'
                }
            ]}
        >
            <ProductForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
