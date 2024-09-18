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
import { clearVendorPaymentState, getVendorPayments } from '@/store/slices/vendorPayments';

const Index = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);

    const { vendorPayments, loading } = useAppSelector((state) => state.vendorPayment);
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
            headerName: 'Vendor',
            valueGetter: (params: any) => params.data.vendor.name + ' (' + params.data.vendor.vendor_number + ')',
            minWidth: 150
        },
        {
            headerName: 'Due',
            valueGetter: (params: any) => {
                const dueAmount = params.data.vendor_bill_payment_details
                    .flatMap((bill: any) => bill.due_amount)
                    .reduce((a: number, b: any) => a + parseFloat(b), 0);
                return dueAmount.toFixed(2);
            },
            minWidth: 150
        },
        {
            headerName: 'Received',
            valueFormatter: (params: any) => {
                const paidAmount = params.data.vendor_bill_payment_details
                    .flatMap((bill: any) => bill.paid_amount)
                    .reduce((a: number, b: any) => a + parseFloat(b), 0);
                return paidAmount.toFixed(2);
            },
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(clearVendorPaymentState());
        dispatch(setPageTitle('Vendor Payments'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getVendorPayments());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Vendor_Payment}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/payments/create'
                    },
                    title: 'Vendor Payments',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/payments/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/purchase/payments/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={vendorPayments}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Vendor_Payment) &&
                        router.push(`/apps/purchase/payments/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
