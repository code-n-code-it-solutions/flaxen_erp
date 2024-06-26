import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/erp/inventory/products/ProductForm";
import {clearRawProductState, editRawProduct} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {rawProduct, loading} = useAppSelector(state => state.rawProduct);

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
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
        if (rawProduct) {
            dispatch(clearRawProductState());
            router.push('/erp/inventory/products');
        }
    }, [rawProduct]);

    useEffect(() => {
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editRawProduct(parseInt(id)))
        }
        dispatch(setPageTitle('Edit Raw Material'));
    }, [router.query]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={loading}
            title="Edit Raw Material"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/products/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/products'
                }
            ]}
        >
            <ProductForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
