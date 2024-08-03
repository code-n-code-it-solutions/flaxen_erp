import React, { useEffect } from 'react';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { clearEmployeeState, editEmployee } from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import EmployeeForm from '@/pages/apps/employees/employee-list/EmployeeForm';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { employee, loading } = useAppSelector(state => state.employee);

    useEffect(() => {
        if (employee) {
            dispatch(clearEmployeeState());
            router.push('/apps/employees/employee-list');
        }
    }, [employee]);

    useEffect(() => {
        const { id } = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editEmployee(parseInt(id)));
        }
    }, [router.query]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Employee}
                title="Edit Employee"
                middleComponent={{
                    show: false,
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/employees/employee-list'
                }}
            />
            <PageWrapper>
                <EmployeeForm id={router.query.id} />
            </PageWrapper>
        </div>

    );
};


// Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
