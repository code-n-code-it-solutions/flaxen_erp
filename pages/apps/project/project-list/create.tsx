import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath} from '@/utils/enums';
import ProjectForm from './ProjectForm';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearProjectState } from '@/store/slices/projects/projectSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Project);
    const dispatch = useAppDispatch();
    const { project, success } = useAppSelector((state) => state.project);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Create new project'));
    }, []);

    useEffect(() => {
        if (project && success) {
            dispatch(clearProjectState());
            router.push(AppBasePath.Project);
        }
    }, [project, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Project}
                title="Create Project"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: AppBasePath.Project
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <ProjectForm />
            </PageWrapper>
        </div>
    );
};

export default Create;
