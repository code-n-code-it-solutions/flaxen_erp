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
import { clearVendorBillState, getVendorBills } from '@/store/slices/vendorBillSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Vendor_Bill);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);

    const { vendorBills, loading } = useAppSelector((state) => state.vendorBill);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Bill Number',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'bill_number',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Vendor',
            field: 'vendor.name',
            minWidth: 150
        },
        {
            headerName: 'Bill Ref',
            field: 'bill_reference',
            minWidth: 150
        },
        {
            headerName: 'Bill Date',
            field: 'bill_date',
            minWidth: 150
        },
        {
            headerName: 'Due Date/Terms',
            valueGetter: (params: any) => params.data.due_date ? params.data.due_date : params.data.payment_terms + ' Days',
            minWidth: 150
        },
        {
            headerName: 'Bill Amount',
            valueGetter: (params: any) => {
                return params.data.good_receive_note_vendor_bill
                    ?.flatMap((invoice: any) => invoice.good_receive_note.raw_products)
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
        dispatch(setPageTitle('Bills'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getVendorBills());
        dispatch(clearVendorBillState());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Vendor_Bill}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/bills/create'
                    },
                    title: 'Vendor Bills',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/bills/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/purchase/bills/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={vendorBills}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Vendor_Bill) &&
                        router.push(`/apps/purchase/bills/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
