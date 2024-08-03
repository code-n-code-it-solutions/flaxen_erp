import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {clearProductAssemblyState} from '@/store/slices/productAssemblySlice';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import ProductAssemblyForm from "@/pages/apps/manufacturing/formula/ProductAssemblyForm";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Product_Assembly);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {productAssembly, success} = useAppSelector(state => state.productAssembly);

    useEffect(() => {
        dispatch(clearProductAssemblyState());
        dispatch(setPageTitle('Create Formula'));
    }, []);

    useEffect(() => {
        if (productAssembly && success) {
            dispatch(clearProductAssemblyState());
            router.push('/apps/manufacturing/formula');
        }
    }, [productAssembly, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            title="Create Formula"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/formula'
                }
            ]}
        >
            <ProductAssemblyForm/>
        </PageWrapper>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
