import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {clearCustomerState, getCustomers} from "@/store/slices/customerSlice";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {customers, loading, success} = useAppSelector((state) => state.customer);
    const [rowData, setRowData] = useState([]);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Customer Dashboard',
            href: '/erp/customer',
        },
        {
            title: 'All Customers',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('All Customers'));
        dispatch(clearCustomerState());
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getCustomers())
    }, []);

    useEffect(() => {
        if (customers && success) {
            setRowData(customers)
        }
    }, [customers, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
            title="All Customer"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/crm/customer/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-customers-' + Date.now()}
                showFooter={false}
                columns={[
                    {
                        accessor: 'customer_code',
                        title: 'Code',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Customers:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'name',
                        title: 'Name',
                        sortable: true
                    },
                    {
                        accessor: 'phone',
                        title: 'Phone',
                        sortable: true
                    },
                    {
                        accessor: 'email',
                        title: 'Email',
                        sortable: true,
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span
                                className={`badge bg-${row.is_active ? 'success' : 'danger'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                            </span>
                        ),
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : acc, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Not Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : acc, 0)}</span>
                                </div>
                            </div>
                        ),
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
                                    link={`/erp/crm/customer/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip='View'
                                    link={`/erp/crm/customer/view/${row.id}`}
                                />
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    link={`/erp/crm/customer/edit/${row.id}`}
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
