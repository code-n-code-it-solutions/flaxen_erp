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
import { ActionList, AppBasePath } from '@/utils/enums';
import { checkPermission } from '@/utils/helper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { getClients } from '@/store/slices/projects/clientSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Client);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { clients, loading, success } = useAppSelector((state) => state.client);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'client_code',
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
            field: 'client_type.name',
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
        dispatch(setPageTitle('Clients'));
        setAuthToken(token);
        dispatch(getClients());
    }, []);

    return (
        <div className="flex flex-col gap-3">
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
                        link: `${AppBasePath.Client}/create`
                    },
                    title: 'Clients',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push(AppBasePath.Client + '/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('printLabel')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={clients}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Client) &&
                        router.push(`${AppBasePath.boq}/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
