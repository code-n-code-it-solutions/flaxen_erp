import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import {
    clearProductAssemblyState,
    editProductAssembly
} from '@/store/slices/productAssemblySlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { getIcon } from '@/utils/helper';
import Button from '@/components/Button';
import ProductAssemblyForm from '@/pages/apps/manufacturing/formula/ProductAssemblyForm';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Edit = () => {
    useSetActiveMenu(AppBasePath.Product_Assembly);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { productAssembly, loading, productAssemblyDetail } = useAppSelector(state => state.productAssembly);

    useEffect(() => {
        if (productAssembly) {
            dispatch(clearProductAssemblyState());
            router.push('/apps/manufacturing/formula');
        }
    }, [productAssembly]);

    useEffect(() => {
        dispatch(clearProductAssemblyState());
        const { id } = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editProductAssembly(parseInt(id)));
        }
        dispatch(setPageTitle('Edit Formula'));
    }, [router.query]);


    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={[]}
            loading={loading}
            title="Edit Formula"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/apps/manufacturing/formula/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/formula'
                }
            ]}
        >
            <ProductAssemblyForm id={router.query.id} />
        </PageWrapper>
    );
};
Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
