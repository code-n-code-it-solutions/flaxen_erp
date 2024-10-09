import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { getRawProducts } from '@/store/slices/rawProductSlice';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { checkPermission } from '@/utils/helper';
import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { clearSaleInvoiceState, getSaleInvoices } from '@/store/slices/saleInvoiceSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Invoice);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { saleInvoices, loading } = useAppSelector((state) => state.saleInvoice);
    const { permittedMenus } = useAppSelector((state) => state.menu);
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
                    .map((item: any) => parseFloat(item.grand_total))
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
        dispatch(setPageTitle('Invoices'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearSaleInvoiceState());
        dispatch(getSaleInvoices());
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Invoice}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/sales/invoices/create'
                    },
                    title: 'Invoices',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/sales/invoices/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/sales/invoices/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={saleInvoices}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Invoice) &&
                        router.push(`/apps/sales/invoices/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
