import React, { useEffect } from 'react';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { clearJobState, editJob } from '@/store/slices/jobSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import JobForm from '@/pages/apps/hrm/jobs/JobForm'; // Corrected import to JobForm (uppercase)
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { employee, loading } = useAppSelector(state => state.employee);

    useEffect(() => {
        if (employee) {
            dispatch(clearJobState());
            router.push(''); // Handle the navigation properly here
        }
    }, [employee]);

    useEffect(() => {
        const { id } = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editJob(parseInt(id)));
        }
    }, [router.query]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Employee}
                title="Edit Job"
                middleComponent={{
                    show: false,
                }}
                backButton={{
                    show: true,
                   // backLink: '/apps/employees/employee-list',
                }}
            />
            <PageWrapper>
                <JobForm /> {/* Corrected to JobForm */}
            </PageWrapper>
        </div>
    );
};

// Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;