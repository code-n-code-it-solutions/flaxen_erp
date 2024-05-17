import React, {useEffect, useState} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {useAppDispatch, useAppSelector} from "@/store";
import GenericTable from "@/components/GenericTable";
import {setAuthToken} from "@/configs/api.config";
import {clearTransactionState, getTransactions} from "@/store/slices/transactionSlice";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {capitalize} from "lodash";
import FundAddFormModal from "@/components/modals/FundAddFormModal";
import {getAccounts} from "@/store/slices/accountSlice";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {transactions, transaction, success, loading} = useAppSelector(state => state.transaction);
    const {accounts} = useAppSelector(state => state.account);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
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
            title: 'Fund Management',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle('Fund Management'));
        setAuthToken(token)
        dispatch(getTransactions())
        dispatch(clearTransactionState())
        dispatch(getAccounts())
    }, []);

    useEffect(() => {
        if (transactions) {
            setRowData(transactions)
        }
    }, [transactions]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={false}
            breadCrumbItems={breadcrumbItems}
            title='Fund Management'
            buttons={[
                {
                    text: 'Add/Transfer Fund',
                    type: ButtonType.button,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    onClick: () => setModalOpen(true)
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-transactions-' + Date.now()}
                columns={[
                    {
                        accessor: 'transaction_code',
                        title: 'Transaction Code',
                        sortable: true
                    },
                    {
                        accessor: 'account.name',
                        title: 'Account',
                        render: (row: any) => (
                            <div className="flex flex-col gap-2">
                                <span>{row.account.account_type_name}</span>
                                <span className="ml-4">{row.account.account_code + ' - ' + row.account.name}</span>
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'type',
                        title: 'Type',
                        render: (row: any) => (
                            <span>{capitalize(row.type)}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'source',
                        title: 'Source',
                        render: (row: any) => (
                            <span>{capitalize(row.source.replace("_", " "))}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'amount',
                        title: 'Amount',
                        render: (row: any) => (
                            <span>{row.amount.toFixed(2)}</span>
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
                ]}
            />
            <FundAddFormModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                modalFormData={{}}
                accounts={accounts}
            />
        </PageWrapper>
    );
};

export default Index;
