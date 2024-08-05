import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { getCustomers } from '@/store/slices/customerSlice';
import { ActionList, AppBasePath } from '@/utils/enums';
import { checkPermission } from '@/utils/helper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Index = () => {
    useSetActiveMenu(AppBasePath.Customer);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { customers, loading, success } = useAppSelector((state) => state.customer);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'customer_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Name',
            field: 'name',
            minWidth: 150
        },
        {
            headerName: 'Phone',
            field: 'phone',
            minWidth: 150
        },
        {
            headerName: 'Type',
            field: 'customer_type.name',
            minWidth: 150
        },
        {
            headerName: 'Email',
            field: 'email',
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'is_active',
            cellRenderer: (row: any) => (
                <span className={`badge bg-${row.data.is_active ? 'success' : 'danger'}`}>
                    {capitalize(row.data.is_active ? 'active' : 'inactive')}
                </span>
            ),
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Products'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getCustomers());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Customer}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/sales/configuration/customers/create'
                    },
                    title: 'Customers',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/sales/configuration/customers/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/sales/configuration/customers/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={customers}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Customer) &&
                        router.push(`/apps/sales/configuration/customers/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
