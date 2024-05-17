import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import WorkspaceLayout from "@/components/Layouts/WorkspaceLayout";

const Detail = () => {
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
            title: 'Company Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Company Details'));
    }, []);

    return (
        <PageWrapper
            title="Company Details"
            breadCrumbItems={breadcrumbItems}
            embedLoader={false}
        >

        </PageWrapper>
    );
};

Detail.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Detail;
