import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearProductionState } from '@/store/slices/productionSlice';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import ProductionForm from '@/pages/apps/manufacturing/operations/production/ProductionForm';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Production);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { production, success } = useAppSelector(state => state.production);

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
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Production}
                title="Create Productions"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/manufacturing/operations/production'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <ProductionForm />
            </PageWrapper>
        </div>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
