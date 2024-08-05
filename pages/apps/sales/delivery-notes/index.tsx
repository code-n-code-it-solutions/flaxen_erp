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
import { getDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import { capitalize } from 'lodash';

const Index = () => {
    useSetActiveMenu(AppBasePath.Delivery_Note);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);
    const {deliveryNotes, loading} = useAppSelector(state => state.deliveryNote);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Delivery Note Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'delivery_note_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Generation Type',
            field: 'generation_type',
            cellRenderer: (row: any) => (
                <span>{capitalize(row.data.generation_type)}</span>
            ),
            minWidth: 150
        },
        {
            headerName: 'Has Quotation',
            valueGetter: (params: any) => params.data.skip_quotation ? 'No' : 'Yes',
            minWidth: 150
        },
        {
            headerName: 'DN For',
            valueGetter: (params: any) => params.data.delivery_note_for===1 ? 'Finished Goods' : 'Materials',
            minWidth: 150
        },
        {
            headerName: 'Receipt Delivery Days',
            field: 'receipt_delivery_due_days',
            minWidth: 150
        },
        {
            headerName: 'Delivery In (Days)',
            field: 'delivery_due_in_days',
            minWidth: 150
        },
        {
            headerName: 'Delivery Due Date',
            field: 'delivery_due_date',
            minWidth: 150
        },
    ]);

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(setPageTitle('Delivery Notes'));
        dispatch(getDeliveryNotes())
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Delivery_Note}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/sales/orders/delivery-notes/create'
                    },
                    title: 'DNs',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/sales/orders/delivery-notes/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/sales/orders/delivery-notes/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={deliveryNotes}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        console.log(params.data);
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Delivery_Note) &&
                        router.push(`/apps/sales/orders/delivery-notes/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
