import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import ProductForm from '@/pages/apps/inventory/products/ProductForm';
import { clearRawProductState, editRawProduct } from '@/store/slices/rawProductSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import View from '@/pages/apps/inventory/products/view/[id]';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Edit = () => {
    useSetActiveMenu(AppBasePath.Raw_Product);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { rawProduct, loading } = useAppSelector(state => state.rawProduct);

    useEffect(() => {
        if (rawProduct) {
            dispatch(clearRawProductState());
            router.push('/apps/inventory/products');
        }
    }, [rawProduct]);

    useEffect(() => {
        const { id } = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editRawProduct(parseInt(id)));
        }
        dispatch(setPageTitle('Edit Raw Material'));
    }, [router.query]);

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            title="Edit Raw Material"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/apps/inventory/products/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/inventory/products'
                }
            ]}
        >
            <ProductForm id={router.query.id} />
        </PageWrapper>
    );
};

Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
