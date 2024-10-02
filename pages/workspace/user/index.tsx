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
            href: '/workspace',
        },
        {
            title: 'User Profile',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('User Profile'));
    }, []);

    return (
        <PageWrapper
            title="Companies"
            breadCrumbItems={breadcrumbItems}
            embedLoader={false}
            // buttons={[
            //     {
            //         text: 'Register Company',
            //         type: ButtonType.link,
            //         variant: ButtonVariant.primary,
            //         icon: IconType.add,
            //         link: '/workspace/companies/create'
            //     }
            // ]}
        >
            <div></div>
        </PageWrapper>
    );
};

Index.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Index;
