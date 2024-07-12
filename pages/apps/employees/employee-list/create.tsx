import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import {clearEmployeeState} from "@/store/slices/employeeSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import EmployeeForm from '@/pages/apps/employees/employee-list/EmployeeForm';
import AppLayout from '@/components/Layouts/AppLayout';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {employee, loading, success} = useAppSelector(state => state.employee);

    useEffect(() => {
        dispatch(setPageTitle('New Employee'));
    }, []);

    useEffect(() => {
        if (employee && success) {
            dispatch(clearEmployeeState());
            router.push('/apps/employees/employee-list');
        }
    }, [employee, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            loading={false}
            title="Create Employee"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/employees/employee-list'
                }
            ]}
        >
            <EmployeeForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
