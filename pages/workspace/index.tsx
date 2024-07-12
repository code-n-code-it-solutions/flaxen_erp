import React, {useEffect} from 'react';
import WorkspaceLayout from "@/components/Layouts/WorkspaceLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user)

    const breadcrumbItems = [
        {
            title: 'Dashboard',
            href: '#',
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    }, []);

    return (
        <PageWrapper
            title="Workspace"
            breadCrumbItems={breadcrumbItems}
            embedLoader={false}
        >
            <h1>Workspace</h1>
        </PageWrapper>
    );
};

Index.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Index;
