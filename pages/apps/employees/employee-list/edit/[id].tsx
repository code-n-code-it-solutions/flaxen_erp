import React, { useEffect } from 'react';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { clearEmployeeState, editEmployee } from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import { ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import EmployeeForm from '@/pages/apps/employees/employee-list/EmployeeForm';
import AppLayout from '@/components/Layouts/AppLayout';

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
        <PageWrapper
            // loading={loading}
            embedLoader={false}
            breadCrumbItems={[]}
            title="Edit Employee"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/apps/employees/employee-list/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/employees/employee-list'
                }
            ]}
        >
            <EmployeeForm id={router.query.id} />
        </PageWrapper>
    );
};


Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
