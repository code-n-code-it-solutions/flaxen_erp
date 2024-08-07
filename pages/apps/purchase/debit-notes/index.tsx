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
import { clearDebitNoteState, getDebitNotes } from '@/store/slices/debitNoteSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Debit_Notes);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { token, menus } = useAppSelector((state) => state.user);
    const { debitNotes, loading } = useAppSelector((state) => state.debitNote);
    const { activeMenu } = useAppSelector((state) => state.menu);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Invoice Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'sale_invoice_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Customer',
            field: 'customer.name',
            valueGetter: (params: any) => params.data.customer.name + ' (' + params.data.customer.customer_code + ')',
            minWidth: 150
        },
        {
            headerName: 'Contact Person',
            field: 'contact_person.name',
            minWidth: 150
        },
        {
            headerName: 'Salesman',
            field: 'salesman.name',
            minWidth: 150
        },
        {
            headerName: 'Invoice Ref',
            field: 'payment_reference',
            minWidth: 150
        },
        {
            headerName: 'Invoice Date',
            field: 'invoice_date',
            minWidth: 150
        },
        {
            headerName: 'Due Date/Terms',
            valueGetter: (params: any) => params.data.due_date ? params.data.due_date : params.data.payment_terms + ' Days',
            minWidth: 150
        },
        {
            headerName: 'Invoice Amount',
            valueGetter: (params: any) => {
                return params.data.delivery_note_sale_invoices
                    .flatMap((invoice: any) => invoice.delivery_note.delivery_note_items)
                    .map((item: any) => parseFloat(item.total_cost))
                    .reduce((a: number, b: number) => a + b, 0).toFixed(2);
            },
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'status',
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Debit Notes'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearDebitNoteState());
        dispatch(getDebitNotes());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Debit_Notes}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/debit-notes/create'
                    },
                    title: 'Debit Note',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/debit-notes/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/purchase/ebit-notes/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={debitNotes}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Debit_Notes) &&
                        router.push(`/apps/purchase/debit-notes/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
