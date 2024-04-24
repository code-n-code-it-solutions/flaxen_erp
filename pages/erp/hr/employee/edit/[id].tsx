import React, {useEffect} from 'react';
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {clearEmployeeState, editEmployee} from "@/store/slices/employeeSlice";
import PageWrapper from "@/components/PageWrapper";
import EmployeeForm from "@/pages/erp/hr/employee/EmployeeForm";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {employee, loading} = useAppSelector(state => state.employee);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'HR Dashboard',
            href: '/erp/hr',
        },
        {
            title: 'All Employees',
            href: '/erp/hr/employee',
        },
        {
            title: 'Edit Employee',
            href: '#',
        },
    ];

    useEffect(() => {
        if (employee) {
            dispatch(clearEmployeeState());
            router.push('/erp/hr/employee');
        }
    }, [employee]);

    useEffect(() => {
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editEmployee(parseInt(id)))
        }
    }, [router.query]);

    return (
        <PageWrapper
            // loading={loading}
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
            title="Edit Employee"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/hr/employee/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/hr/employee'
                }
            ]}
        >
            <EmployeeForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
