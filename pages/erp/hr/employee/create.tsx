import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import EmployeeForm from "@/pages/erp/hr/employee/EmployeeForm";
import PageWrapper from "@/components/PageWrapper";
import {clearEmployeeState} from "@/store/slices/employeeSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {employee, loading, success} = useAppSelector(state => state.employee);
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
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('New Employee'));
    }, []);

    useEffect(() => {
        if (employee && success) {
            dispatch(clearEmployeeState());
            router.push('/erp/hr/employee');
        }
    }, [employee, success]);

    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadCrumbItems}
            loading={loading}
            title="Create Employee"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/hr/employee'
                }
            ]}
        >
            <EmployeeForm/>
        </PageWrapper>
    );
};

export default Create;
