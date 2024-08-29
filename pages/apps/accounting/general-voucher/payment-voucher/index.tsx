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
import { clearGeneralPaymentVoucherState, getGeneralPaymentVouchers } from '@/store/slices/generalPaymentVoucherSlice';
import { capitalize } from 'lodash';

const Index = () => {
    useSetActiveMenu(AppBasePath.General_Payment_Voucher);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);

    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { generalPaymentVouchers, loading, success } = useAppSelector((state) => state.generalPaymentVoucher);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'GPV Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'payment_voucher_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Description',
            field: 'description',
            minWidth: 150
        },
        {
            headerName: 'Date',
            field: 'payment_date',
            minWidth: 150
        },
        {
            headerName: 'Method',
            field: 'payment_method.name',
            minWidth: 150
        },
        {
            headerName: 'Ref #',
            field: 'reference_no',
            minWidth: 150
        },
        {
            headerName: 'Payee',
            valueGetter: (row: any) => capitalize(row.data.subject_category.replace('_', ' ')),
            field: 'subject_category',
            minWidth: 150
        },
        {
            headerName: 'Paid To',
            valueGetter: (row: any) => row.data.subject_category === 'walk_in' ? row.data.name : row.data.subject.name,
            minWidth: 150
        },
        {
            headerName: 'Amount',
            valueGetter: (row: any) => row.data.amount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ),
            field: 'amount',
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('GPV List'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearGeneralPaymentVoucherState());
        dispatch(getGeneralPaymentVouchers());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.General_Payment_Voucher}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/accounting/general-voucher/payment-voucher/create'
                    },
                    title: 'General Payment Voucher',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/accounting/general-voucher/payment-voucher/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={generalPaymentVouchers}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.General_Payment_Voucher) &&
                        router.push(`/apps/accounting/general-voucher/payment-voucher/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
