import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import ProductForm from '@/pages/apps/inventory/products/ProductForm';
import { clearRawProductState } from '@/store/slices/rawProductSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const Create = () => {
    useSetActiveMenu(AppBasePath.Raw_Product);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { rawProduct } = useAppSelector(state => state.rawProduct);

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
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Raw_Product}
                title="New Product"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/inventory/products'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <ProductForm />
            </PageWrapper>
        </div>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
