import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { setPageTitle } from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import { ButtonType, ButtonVariant, IconType } from "@/utils/enums";
import JobForm from '@/pages/apps/hrm/jobs/JobForm'; // Correctly importing the JobForm component

import AppLayout from '@/components/Layouts/AppLayout';
import { clearJobState } from '@/store/slices/jobSlice';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { employee, loading, success } = useAppSelector(state => state.employee);

    useEffect(() => {
        dispatch(setPageTitle('New Job'));
    }, []);

    useEffect(() => {
        if (employee && success) {
            dispatch(clearJobState());
            router.push('/apps/hrm/jobs'); // Redirect to job list after successful creation
        }
    }, [employee, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            loading={false}
            title="Create Job"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/hrm/jobs'
                }
            ]}
        >
            {/* Render the JobForm component */}
            <JobForm />
        </PageWrapper>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
