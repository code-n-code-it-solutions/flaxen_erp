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
import { clearCustomerPaymentState, getCustomerPayments } from '@/store/slices/customerPayment';

const Index = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { customerPayments, loading } = useAppSelector((state) => state.customerPayment);
    const { permittedMenus } = useAppSelector((state) => state.menu);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Payment Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'payment_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Ref #',
            field: 'reference_no',
            minWidth: 150
        },
        {
            headerName: 'Payment Method',
            field: 'payment_method.name',
            minWidth: 150
        },
        {
            headerName: 'Date',
            field: 'payment_date',
            minWidth: 150
        },
        {
            headerName: 'Payment Type',
            field: 'payment_type',
            minWidth: 150
        },
        {
            headerName: 'Customer',
            valueGetter: (params: any) => params.data.customer.name + ' (' + params.data.customer.customer_code + ')',
            minWidth: 150
        },
        {
            headerName: 'Due',
            valueGetter: (params: any) => {
                const dueAmount = params.data.customer_payment_details
                    .flatMap((invoice: any) => invoice.due_amount)
                    .reduce((a: number, b: any) => a + parseFloat(b), 0);
                return dueAmount.toFixed(2);
            },
            minWidth: 150
        },
        {
            headerName: 'Received',
            valueFormatter: (params: any) => {
                const receivedAmount = params.data.customer_payment_details
                    .flatMap((invoice: any) => invoice.received_amount)
                    .reduce((a: number, b: any) => a + parseFloat(b), 0);
                return receivedAmount.toFixed(2);
            },
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(clearCustomerPaymentState());
        dispatch(setPageTitle('Customer Payments'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getCustomerPayments());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Invoice_Payment}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/invoicing/customers/payments/create'
                    },
                    title: 'Customer Payments',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/invoicing/customers/payments/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/invoicing/customers/payments/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={customerPayments}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Invoice_Payment) &&
                        router.push(`/apps/invoicing/customers/payments/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
