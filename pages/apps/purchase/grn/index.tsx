import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
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
import { getGRN } from '@/store/slices/goodReceiveNoteSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Good_Receive_Note);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { allGRNs, loading, success } = useAppSelector(state => state.goodReceiveNote);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'GRN #',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 150,
            valueGetter: (params: any) => params.data.grn_number,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Vendor',
            valueGetter: (params: any) => params.data.vendor?.name,
            minWidth: 150
        },
        {
            headerName: 'Generation Type',
            field: 'generation_type',
            minWidth: 150
        },
        {
            headerName: 'Created By',
            field: 'created_by.name',
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'status',
            minWidth: 150
        },
    ]);

    useEffect(() => {
        dispatch(setPageTitle('GRNs'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getGRN());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Good_Receive_Note}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/grn/create'
                    },
                    title: 'GRNs',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/grn/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allGRNs}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Good_Receive_Note) &&
                        router.push(`/apps/purchase/grn/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
