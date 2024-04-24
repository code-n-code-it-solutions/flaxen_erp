import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import Image from "next/image";
import {clearEmployeeState, getEmployees} from "@/store/slices/employeeSlice";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {serverFilePath} from "@/utils/helper";
import GenericTable from "@/components/GenericTable";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {employees, loading, success} = useAppSelector((state: IRootState) => state.employee);

    const [rowData, setRowData] = useState<any>([]);

    const breadCrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'HR Dashboard',
            href: '/erp/hr',
        },
        {
            title: 'All Employees',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle('All Employees'));
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getEmployees())
        dispatch(clearEmployeeState());
    }, []);

    useEffect(() => {
        if (employees) {
            setRowData(employees)
        }
    }, [employees]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            title={'All Employees'}
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/hr/employee/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-employees-' + Date.now()}
                columns={[
                    {
                        accessor: 'image_id',
                        title: 'Photo',
                        render: (row: any) => (
                            <Image
                                src={serverFilePath(row.employee?.thumbnail?.path)}
                                alt={row.name}
                                priority={true}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                            />
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'employee_code',
                        title: 'Employee Code',
                        render: (row: any) => (
                            <span>{row.employee?.employee_code}</span>
                        ),
                        sortable: true
                    },
                    {accessor: 'name', title: 'name', sortable: true},
                    {accessor: 'email', title: 'Email', sortable: true},
                    {accessor: 'employee.passport_number', title: 'Passport #', sortable: true},
                    {
                        accessor: 'employee.address',
                        title: 'Address',
                        render: (row: any) => (
                            <span>
                                {row.employee?.address} {row.employee?.city?.name} {row.employee?.state?.name}, <br/>
                                {row.employee?.country?.name}, {row.employee?.postal_code}
                            </span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.print}
                                    color={ButtonVariant.secondary}
                                    tooltip='Print'
                                    link={`/erp/hr/employee/print/${row.employee.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip='View'
                                    link={`/erp/hr/employee/view/${row.employee.id}`}
                                />

                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    link={`/erp/hr/employee/edit/${row.employee.id}`}
                                />
                            </div>
                        )
                    }
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
