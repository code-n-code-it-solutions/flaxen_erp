import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { getPurchaseRequisitions } from '@/store/slices/purchaseRequisitionSlice';
import { checkPermission } from '@/utils/helper';
import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Index = () => {
    const router = useRouter();
    useSetActiveMenu(AppBasePath.Purchase_Requisition);
    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const {purchaseRequests, loading, success} = useAppSelector(state => state.purchaseRequisition);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'PR Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'pr_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Title',
            field: 'pr_title',
            minWidth: 150
        },
        {
            headerName: 'Employee',
            field: 'employee.name',
            minWidth: 150
        },
        {
            headerName: 'Department',
            field: 'department.name',
            valueGetter: (row: any) => row.data.department ? row.data.department?.name : 'N/A',
            minWidth: 150
        },
        {
            headerName: 'Designation',
            field: 'designation.name',
            valueGetter: (row: any) => row.data.designation ? row.data.designation?.name : 'N/A',
            minWidth: 150
        },
        {
            headerName: 'Type',
            field: 'type',
            minWidth: 150
        },
        {
            headerName: 'PR Date',
            field: 'requisition_date',
            minWidth: 150
        },
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Purchase Requisitions'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getPurchaseRequisitions())
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Purchase_Requisition}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/purchase-requisition/create'
                    },
                    title: 'PRs',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/purchase-requisition/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={purchaseRequests}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Purchase_Requisition) &&
                        router.push(`/apps/purchase/purchase-requisition/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
