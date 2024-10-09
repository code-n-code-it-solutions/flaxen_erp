import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath} from '@/utils/enums';
import BOQForm from './BOQForm';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearBOQState } from '@/store/slices/projects/boqSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.boq);
    const dispatch = useAppDispatch();
    const { boq, success } = useAppSelector((state) => state.boq);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new BOQ'));
    }, []);

    useEffect(() => {
        if (boq && success) {
            dispatch(clearBOQState());
            router.push(AppBasePath.Client);
        }
    }, [boq, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.boq}
                title="Create BOQ"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: AppBasePath.boq
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <BOQForm />
            </PageWrapper>
        </div>
    );
};

export default Create;
