import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { ActionList, AppBasePath } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { getLPO } from '@/store/slices/localPurchaseOrderSlice';
import { checkPermission } from '@/utils/helper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Index = () => {
    const router = useRouter();
    useSetActiveMenu(AppBasePath.Local_Purchase_Order);
    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const {allLPOs, loading, success} = useAppSelector(state => state.localPurchaseOrder);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'LPO #',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'lpo_number',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Type',
            field: 'type',
            minWidth: 150
        },
        {
            headerName: 'Vendor',
            field: 'vendor.name',
            minWidth: 150
        },
        {
            headerName: 'Vendor Rep',
            field: 'vendor_representative.name',
            minWidth: 150
        },{
            headerName: 'Due Date',
            field: 'delivery_due_date',
            minWidth: 150
        },
    ]);

    useEffect(() => {
        dispatch(setPageTitle('LPOs'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getLPO())
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Local_Purchase_Order}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/lpo/create'
                    },
                    title: 'LPOs',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/lpo/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allLPOs}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Local_Purchase_Order) &&
                        router.push(`/apps/purchase/lpo/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
