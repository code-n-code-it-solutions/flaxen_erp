import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/erp/inventory/products/ProductForm";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {rawProduct} = useAppSelector(state => state.rawProduct);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'All Raw Materials',
            href: '/erp/inventory/products',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];
    useEffect(() => {
        dispatch(setPageTitle('Create Raw Material'));
    }, []);

    useEffect(() => {
        if (rawProduct) {
            dispatch(clearRawProductState());
            router.push('/erp/inventory/products');
        }
    }, [rawProduct]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
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

export default Create;
