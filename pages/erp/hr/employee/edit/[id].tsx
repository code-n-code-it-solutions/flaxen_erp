import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {clearEmployeeState, editEmployee} from "@/store/slices/employeeSlice";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";
import EmployeeForm from "@/pages/erp/hr/employee/EmployeeForm";

const Edit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {employee, loading} = useSelector((state: IRootState) => state.employee);
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
            loading={loading}
            embedLoader={true}
            breadCrumbItems={breadCrumbItems}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Edit Employee Detail
                    </h5>
                    <Link href="/hr/employee"
                          className="btn btn-primary btn-sm m-1">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>
                    </Link>
                </div>
                <EmployeeForm id={router.query.id}/>
            </div>
        </PageWrapper>
    );
};

export default Edit;
