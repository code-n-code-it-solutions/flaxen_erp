import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {clearProductAssemblyState} from '@/store/slices/productAssemblySlice';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import ProductAssemblyForm from "@/pages/erp/inventory/product-assembly/ProductAssemblyForm";
import {setPageTitle} from "@/store/slices/themeConfigSlice";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {productAssembly, success} = useAppSelector(state => state.productAssembly);

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'All Product Assemblies',
            href: '/erp/inventory/product-assembly',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(clearProductAssemblyState());
        dispatch(setPageTitle('Create Product Assembly'));
    }, []);

    useEffect(() => {
        if (productAssembly && success) {
            dispatch(clearProductAssemblyState());
            router.push('/erp/inventory/product-assembly');
        }
    }, [productAssembly, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumbItems}
            title="Create Formula"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/product-assembly'
                }
            ]}
        >
            <ProductAssemblyForm/>
        </PageWrapper>
    );
};

export default Create;
