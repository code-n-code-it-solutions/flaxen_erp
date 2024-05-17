import React, {useEffect} from 'react';
import WorkspaceLayout from "@/components/Layouts/WorkspaceLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import CompanyForm from "@/pages/workspace/companies/CompanyForm";

const Create = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user)

    const breadcrumbItems = [
        {
            title: 'Dashboard',
            href: '/workspace',
        },
        {
            title: 'Companies',
            href: '/workspace/companies',
        },
        {
            title: 'Register Company',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Company Details'));
    }, []);

    return (
        <PageWrapper
            title="Register Company"
            breadCrumbItems={breadcrumbItems}
            embedLoader={false}
        >
            <CompanyForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Create;
