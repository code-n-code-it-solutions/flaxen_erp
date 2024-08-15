import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import { getAccounts } from '@/store/slices/accountSlice';
import { ChevronDownIcon, ChevronRightIcon, EyeIcon } from 'lucide-react';
import Modal from '@/components/Modal';
import GenericTable from '@/components/GenericTable';
import { capitalize, now, upperFirst } from 'lodash';
import { clearAccountTransactionState, getTransactionByAccount } from '@/store/slices/accountTransactionSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Report_Accounts);
    const dispatch = useAppDispatch();

    const { token, user } = useAppSelector((state) => state.user);
    const accounts = useAppSelector((state) => state.account).accounts;
    const { accountTransactions, loading } = useAppSelector((state) => state.accountTransaction);

    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
    const [accountDetail, setAccountDetail] = useState<any>({});
    const [accountDetailModal, setAccountDetailModal] = useState<boolean>(false);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Accounts Report'));
        setContentType('application/json');
        dispatch(getAccounts());
    }, []);

    useEffect(() => {
        if (!accountDetailModal) {
            dispatch(clearAccountTransactionState());
        }
    }, [accountDetailModal]);

    useEffect(() => {
        if (accounts) {
            // console.log(accounts);
            setFilteredAccounts(accounts);
        }
    }, [accounts]);

    useEffect(() => {
        const filterAccounts = (accounts: any[], term: string): any[] => {
            return accounts
                .map((accountType) => ({
                    ...accountType,
                    accounts: accountType.accounts
                        .map((account: any) => {
                            const children = filterAccounts(account.accounts || [], term);
                            const isMatching = account.code.toString().toLowerCase().includes(term) || account.name.toLowerCase().includes(term);
                            if (isMatching || children.length > 0) {
                                return { ...account, accounts: children };
                            }
                            return null;
                        })
                        .filter(Boolean)
                }))
                .filter((accountType) => accountType.accounts.length > 0);
        };

        if (accounts && searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filteredData = filterAccounts(accounts, lowercasedFilter);
            setFilteredAccounts(filteredData);
        } else {
            setFilteredAccounts(accounts);
        }
    }, [searchTerm, accounts]);

    const toggleRow = (key: string) => {
        setExpandedRows((prev) =>
            prev.includes(key) ? prev.filter((rowKey) => rowKey !== key) : [...prev, key]
        );
    };

    const expandAll = () => {
        let allKeys: string[] = [];

        const collectKeys = (account: any) => {
            allKeys.push(`account-${account.id}`);
            if (account.accounts && account.accounts.length > 0) {
                account.accounts.forEach((child: any) => collectKeys(child));
            }
        };

        accounts.forEach((accountType: any) =>
            accountType.accounts.forEach((account: any) => collectKeys(account))
        );

        setExpandedRows(allKeys);
    };

    const calculateTotals = () => {
        let totalDebit = 0;
        let totalCredit = 0;
        let totalBalance = 0;

        filteredAccounts && filteredAccounts.forEach((accountType: any) => {
            accountType.accounts.forEach((account: any) => {
                totalDebit += account.totals.debit;
                totalCredit += account.totals.credit;
                totalBalance += account.totals.balance;
            });
        });

        return { totalDebit, totalCredit, totalBalance };
    };

    const renderRow = (account: any, level = 0) => {
        // console.log(account);
        const isExpanded = expandedRows.includes(`account-${account.id}`);
        const hasChildren = account.accounts && account.accounts.length > 0;

        return (
            <React.Fragment key={`account-${account.id}`}>
                <tr>
                    <td>
                        <div className="flex" style={{ paddingLeft: `${level * 30}px` }}>
                            {hasChildren && (
                                <button onClick={() => toggleRow(`account-${account.id}`)}
                                        className="focus:outline-none">
                                    {isExpanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                                </button>
                            )}
                            <span>{account.code}</span>
                        </div>
                    </td>
                    <td>{account.name}</td>
                    <td className="text-right">
                        {account.totals
                            ? account.totals.debit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                            : ''}
                    </td>
                    <td className="text-right">
                        {account.totals
                            ? account.totals.credit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                            : ''}
                    </td>
                    <td className="text-right">
                        {account.totals
                            ? account.totals.balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                            : ''}
                    </td>
                    <td>
                        {level > 0 && (
                            <button
                                className="text-primary btn-sm"
                                onClick={() => {
                                    console.log(account);
                                    setAccountDetailModal(true);
                                    dispatch(clearAccountTransactionState());
                                    dispatch(getTransactionByAccount(account.id));
                                    setAccountDetail(account);
                                }}
                            >
                                <EyeIcon size={18} />
                            </button>
                        )}
                    </td>
                </tr>
                {isExpanded &&
                    hasChildren &&
                    account.accounts.map((child: any) => renderRow(child, level + 1))}
            </React.Fragment>
        );
    };

    const { totalDebit, totalCredit, totalBalance } = calculateTotals();

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                appBasePath={AppBasePath.Report_Accounts}
                leftComponent={{
                    addButton: {
                        show: false
                    },
                    title: 'Accounts',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={false}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => console.log('print'),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('printLabel')
                }}
            />
            <PageWrapper>
                <div className="flex flex-col gap-3 mb-3 w-full">
                    <input
                        type="text"
                        placeholder="Search by Account Code or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                    />
                    <div className="flex justify-center gap-3 w-full">
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={expandAll}
                        >
                            Expand All
                        </span>
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={() => setExpandedRows([])}
                        >
                            Collapse All
                        </span>
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={() => dispatch(getAccounts())}
                        >
                            Refresh
                        </span>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th>Account Code</th>
                            <th>Account Name</th>
                            <th className="text-right">Debit</th>
                            <th className="text-right">Credit</th>
                            <th className="text-right">Balance</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAccounts && filteredAccounts.map((accountType: any) => renderRow(accountType))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2} className="text-right font-bold">Total</td>
                            <td className="text-right font-bold">{totalDebit.toFixed(2)}</td>
                            <td className="text-right font-bold">{totalCredit.toFixed(2)}</td>
                            <td className="text-right font-bold">{totalBalance.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </PageWrapper>

            <Modal
                title={accountDetail ? 'Ledger of ' + accountDetail.code + ' - ' + accountDetail.name : ''}
                show={accountDetailModal}
                setShow={setAccountDetailModal}
                size="xl"
            >
                <GenericTable
                    rowData={accountTransactions}
                    columns={[
                        {
                            accessor: 'created_at',
                            title: 'Date',
                            render: (row: any) => new Date(row.created_at).toLocaleDateString(),
                            sortable: true
                        },
                        {
                            accessor: 'document_no',
                            title: 'Document No',
                            sortable: true
                        },
                        {
                            accessor: 'transaction_through',
                            title: 'Source',
                            render: (row: any) => capitalize(row.transaction_through.replace('_', ' ')),
                            sortable: true
                        },
                        {
                            accessor: 'description',
                            title: 'Narration',
                            sortable: true
                        },
                        {
                            accessor: 'account_name',
                            title: 'Account Name',
                            sortable: true
                        },
                        {
                            accessor: 'debit',
                            title: 'Debit',
                            render: (row: any) => row.debit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }),
                            sortable: true
                        },
                        {
                            accessor: 'credit',
                            title: 'Credit',
                            render: (row: any) => row.credit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }),
                            sortable: true
                        },
                        {
                            accessor: 'balance',
                            title: 'Balance',
                            render: (row: any) => row.balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }),
                            sortable: true
                        }
                    ]}
                    loading={loading}
                    exportTitle={'account-transactions-' + now()}
                    isAdvanced={true}
                />
            </Modal>
        </div>
    );
};

export default Index;
