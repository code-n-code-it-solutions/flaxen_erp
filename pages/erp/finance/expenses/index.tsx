import React, {useEffect, useState} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {useAppDispatch, useAppSelector} from "@/store";
import Image from "next/image";
import {serverFilePath} from "@/utils/helper";
import IconButton from "@/components/IconButton";
import GenericTable from "@/components/GenericTable";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {clearExpenseState, getExpenses} from "@/store/slices/expenseSlice";
import {capitalize} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {expenses, loading} = useAppSelector(state => state.expense);

    const [rowData, setRowData] = useState<any[]>([]);

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Finance Dashboard',
            href: '/erp/finance',
        },
        {
            title: 'All Expenses',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle('Fund Management'));
        setAuthToken(token)
        dispatch(clearExpenseState())
        dispatch(getExpenses())
    }, []);

    useEffect(() => {
        if (expenses) {
            setRowData(expenses)
        }
    }, [expenses]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title='All Expenses'
            buttons={[
                {
                    text: 'Add Expense',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/finance/expenses/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-transactions-' + Date.now()}
                columns={[
                    {
                        accessor: 'expense_code',
                        title: 'Expense Code',
                        sortable: true
                    },
                    {
                        accessor: 'ref_no',
                        title: 'Ref #',
                        sortable: true
                    },
                    {
                        accessor: 'payment_method',
                        title: 'Payment Method',
                        render: (row: any) => (
                            <span>{capitalize(row.payment_method)}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'paid_to',
                        title: 'Paid To',
                        render: (row: any) => (
                            <span>{capitalize(row.payment_method)}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'created_by',
                        title: 'Created By',
                        render: (row: any) => (
                            <span>{row.created_by?.name}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'created_at',
                        title: 'Created At',
                        render: (row: any) => (
                            <span>{(new Date(row.created_at)).toLocaleDateString() + ' ' + (new Date(row.created_at)).toLocaleTimeString()}</span>
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
                                    link={`/erp/finance/expenses/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip='View'
                                    link={`/erp/finance/expenses/view/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    tooltip='Edit'*/}
                                {/*    link={`/erp/finance/expenses/edit/${row.id}`}*/}
                                {/*/>*/}
                            </div>
                        )
                    }
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
