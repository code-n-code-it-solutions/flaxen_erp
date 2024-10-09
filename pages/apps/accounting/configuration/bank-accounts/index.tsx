import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { checkPermission } from '@/utils/helper';
import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { clearBankAccountState, getBankAccounts } from '@/store/slices/bankAccountSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Bank_Accounts);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);

    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { bankAccounts, loading, success } = useAppSelector((state) => state.bankAccount);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Account Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'account.code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Bank',
            field: 'bank.name',
            minWidth: 150
        },
        {
            headerName: 'Account Name',
            field: 'account_name',
            minWidth: 150
        },
        {
            headerName: 'account_number',
            field: 'account_number',
            minWidth: 150
        },
        {
            headerName: 'IBAN',
            field: 'iban',
            minWidth: 150
        },
        {
            headerName: 'Swift Code',
            field: 'swift_code',
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Bank Accounts'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearBankAccountState());
        dispatch(getBankAccounts());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Bank_Accounts}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: `${AppBasePath.Bank_Accounts}/create`
                    },
                    title: 'Bank Accounts',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push(AppBasePath.Bank_Accounts + '/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={bankAccounts}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Bank_Accounts) &&
                        router.push(`${AppBasePath.Bank_Accounts}/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
