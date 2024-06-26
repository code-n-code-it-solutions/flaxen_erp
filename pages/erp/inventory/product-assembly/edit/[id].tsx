import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {
    clearProductAssemblyState,
    editProductAssembly,
} from "@/store/slices/productAssemblySlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import Button from "@/components/Button";
import ProductAssemblyForm from "@/pages/erp/inventory/product-assembly/ProductAssemblyForm";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {productAssembly, loading, productAssemblyDetail} = useAppSelector(state => state.productAssembly);

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
            title: 'All Product Assembly',
            href: '/erp/inventory/product-assembly',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        if (productAssembly) {
            dispatch(clearProductAssemblyState());
            router.push('/erp/inventory/product-assembly');
        }
    }, [productAssembly]);

    useEffect(() => {
        dispatch(clearProductAssemblyState());
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editProductAssembly(parseInt(id)))
        }
        dispatch(setPageTitle('Edit Product Assembly'));
    }, [router.query]);


    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadCrumbItems}
            loading={loading}
            title="Edit Formula"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/product-assembly/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/product-assembly'
                }
            ]}
        >
            <ProductAssemblyForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
